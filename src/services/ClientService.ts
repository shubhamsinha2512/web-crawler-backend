import { IClient, IClientDto } from "../common/interfaces/IClient";
import { EntityToDtoSerializer } from "../common/serializer/EntityToDtoSerialier";
import { utils } from "../common/utils/utils";
import Client from "../models/ClientModel";
import { clientRepository } from "../repositories/ClientRepository";
import { elasticSearchService } from "./ElasticSearchService";

class ClientService {
    private constructor() {
        Client.sync({ alter: true })
            .then(() => {
                console.log('Client table created')
                this.createClientFreeTextIndex()
                    .then(() => console.log(`Created ${ClientService.FULL_TEXT_INDEX_NAME} index`))
            });

        elasticSearchService.createIndex(ClientService.ELASTIC_CLIENT_INDEX, {

        }).then(() => console.log(`Created ${ClientService.ELASTIC_CLIENT_INDEX} index`))
    }
    private static instance: ClientService;

    public static getInstance(): ClientService {
        if (!ClientService.instance) {
            ClientService.instance = new ClientService();
        }
        return ClientService.instance;
    }

    public static ELASTIC_CLIENT_INDEX: string = 'clients';
    public static FULL_TEXT_INDEX_NAME: string = 'full_text_idx';
    public static FIELD_MAP: any = {
        "name": "CompanyName",
        "Roc": "RoC",
        "companyStatus": "CompanyStatus",
        "companyActivity": "CompanyActivity",
        "cin": "CIN",
        "registrationDate": "RegistrationDate",
        "category": "Category",
        "subCategory": "SubCategory",
        "companyClass": "CompanyClass",
        "state": "State",
        "pin": "PINCode",
        "country": "Country",
        "address": "Address",
        "email": "Email",
    }

    public async getClients(query: any): Promise<IClientDto | IClientDto[]> {
        try {
            let clients: IClient[] = [] as IClient[];
            const columns = Object.keys(ClientService.FIELD_MAP).join(', ');

            if (!utils.isEmpty(query.q)) {
                // Free Text Search

                if (!utils.isEmpty(query.es) && query.es === 'true') {
                    const fields = Object.keys(ClientService.FIELD_MAP);
                    clients = await elasticSearchService.freeTextSearch(ClientService.ELASTIC_CLIENT_INDEX, query.q, fields) as unknown as IClientDto[];
                } else {
                    const searchTerm = query.q;

                    const SQLQuery = `SELECT MATCH(${columns}) AGAINST('*${searchTerm}*' IN BOOLEAN MODE) as score, clients.* 
                        FROM clients WHERE MATCH(${columns}) AGAINST('*${searchTerm}*' IN BOOLEAN MODE) ORDER BY score DESC;`;
                    clients = await clientRepository.runQuery(SQLQuery);
                }
            } else {
                clients = await clientRepository.getClients(query);
            }

            const clientsDto: IClientDto[] = EntityToDtoSerializer.serializeMultipleClientEntityToDto(clients);
            return Promise.resolve(clientsDto);
        } catch (exception) {
            return Promise.reject(exception);
        }
    }

    public async getClientById(id: number): Promise<IClientDto> {
        try {
            const query = { id: id };
            const clients: IClient[] = await clientRepository.getClients(query);
            let foundClient: IClientDto = !utils.isEmpty(clients?.[0]) ? EntityToDtoSerializer.serializeClientEntityToDto(clients?.[0]) : {} as IClientDto;

            return Promise.resolve(foundClient);
        } catch (exception) {
            return Promise.reject(exception);
        }
    }


    public async saveClient(clientsData: IClientDto | IClientDto[]): Promise<IClientDto | IClientDto[]> {
        try {
            const clients: IClientDto[] = [] as IClientDto[];
            let savedClients: IClient | IClient[] = {} as IClient | IClient[];
            let savedClientsDto: IClientDto | IClientDto[] = {} as IClientDto | IClientDto[];

            if (Array.isArray(clientsData)) {
                clients.push(...clientsData);
                savedClients = await clientRepository.saveClientBulk(clients);
                savedClientsDto = EntityToDtoSerializer.serializeMultipleClientEntityToDto(savedClients);
                await elasticSearchService.bulkCreate(ClientService.ELASTIC_CLIENT_INDEX, clientsData)
            } else {
                savedClients = await clientRepository.saveClient(clientsData);
                savedClientsDto = EntityToDtoSerializer.serializeClientEntityToDto(savedClients);
                await elasticSearchService.createDocument(ClientService.ELASTIC_CLIENT_INDEX, clientsData);
            }

            return Promise.resolve(savedClientsDto);
        } catch (exception) {
            return Promise.reject(exception);
        }
    }

    public async updateClient(id: number, clientData: IClientDto): Promise<IClientDto> {
        try {
            const query = { id: id };
            const updates: any = { ...clientData };

            const updatedClient: IClient = await clientRepository.updateClient(query, updates);
            const foundUpdatedClinet: IClient = await this.getClientById(id) as IClient;
            const foundUpdatedClinetDto: IClientDto = EntityToDtoSerializer.serializeClientEntityToDto(foundUpdatedClinet);
            await elasticSearchService.updateDocument(ClientService.ELASTIC_CLIENT_INDEX, foundUpdatedClinetDto.id.toString(), foundUpdatedClinetDto);

            return Promise.resolve(foundUpdatedClinetDto);
        } catch (exception) {
            return Promise.reject(exception);
        }
    }

    public async deleteClient(id: number): Promise<any> {
        try {
            const deletedRows = await clientRepository.delteClient(id);
            await elasticSearchService.deleteDocuments(ClientService.ELASTIC_CLIENT_INDEX, id.toString());

            return Promise.resolve(id);
        } catch (exception) {
            return Promise.reject(exception);
        }
    }

    public async truncateOldDate(): Promise<void> {
        try {
            console.warn('Truncating Old Clients Data');

            const indexQuery = `TRUNCATE TABLE clients;`;
            await clientRepository.runQuery(indexQuery, false);

        } catch (exception) {
            return Promise.reject(exception);
        }
    }

    public async createClientFreeTextIndex(): Promise<void> {
        try {
            const columns = Object.keys(ClientService.FIELD_MAP).join(', ');
            const indexQuery = `SHOW INDEX FROM clients;`;
            const foundIndexes = await clientRepository.runQuery(indexQuery);
            const FullTextIndexs = foundIndexes.filter((index: any) => index.Key_name === ClientService.FULL_TEXT_INDEX_NAME);

            if (!utils.isEmpty(FullTextIndexs)) {
                const query = `ALTER TABLE clients DROP INDEX ${ClientService.FULL_TEXT_INDEX_NAME}, ADD FULLTEXT ${ClientService.FULL_TEXT_INDEX_NAME} (${columns})`;
                await clientRepository.runQuery(query, false);
            } else {
                const query = `CREATE FULLTEXT INDEX full_text_idx ON clients(${columns});`;
                await clientRepository.runQuery(query, false);
            }
        } catch (exception) {
            return Promise.reject(exception);
        }
    }

    public async syncSqlDBToElastic(): Promise<IClientDto[]> {
        try {
            console.info('Syncing SQL DB to Elastic Search');
            const clients: IClientDto[] = await this.getClients({}) as IClientDto[];

            //Delete ES Data
            await elasticSearchService.deleteDocuments(ClientService.ELASTIC_CLIENT_INDEX, {});

            //Repopulate ES Daat
            await elasticSearchService.bulkCreate(ClientService.ELASTIC_CLIENT_INDEX, clients);

            return Promise.resolve(clients);
        } catch (exception) {
            return Promise.reject(exception);
        }
    }
}

export const clientService = ClientService.getInstance();