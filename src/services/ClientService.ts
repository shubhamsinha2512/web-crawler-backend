import { IClient, IClientDto } from "../common/interfaces/IClient";
import { EntityToDtoSerializer } from "../common/serializer/EntityToDtoSerialier";
import { utils } from "../common/utils/utils";
import Client from "../models/ClientModel";
import { clientRepository } from "../repositories/ClientRepository";

class ClientService {
    private constructor() {
        Client.sync({ alter: true })
            .then(() => {
                console.log('Client table created')
                this.createClientFreeTextIndex()
                    .then(() => console.log(`Created ${ClientService.FULL_TEXT_INDEX_NAME} index`))
            });
    }
    private static instance: ClientService;

    public static getInstance(): ClientService {
        if (!ClientService.instance) {
            ClientService.instance = new ClientService();
        }
        return ClientService.instance;
    }

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
                const searchTerm = query.q;

                const SQLQuery = `SELECT MATCH(${columns}) AGAINST('*${searchTerm}*' IN BOOLEAN MODE) as score, clients.* 
                    FROM clients WHERE MATCH(${columns}) AGAINST('*${searchTerm}*' IN BOOLEAN MODE) ORDER BY score DESC;`;
                clients = await clientRepository.runQuery(SQLQuery);
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
            } else {
                savedClients = await clientRepository.saveClient(clientsData);
                savedClientsDto = EntityToDtoSerializer.serializeClientEntityToDto(savedClients);
            }

            return Promise.resolve(savedClientsDto);
        } catch (exception) {
            return Promise.reject(exception);
        }
    }

    public async updateClient(id: number, clientData: IClientDto): Promise<IClientDto> {
        try {
            const query = { id: id };
            const updates: any = {};

            if (!utils.isEmpty(clientData.name)) {
                updates.name = clientData.name;
            }

            if (!utils.isEmpty(clientData.email)) {
                updates.email = clientData.email;
            }

            if (!utils.isEmpty(clientData.cin)) {
                updates.cin = clientData.cin;
            }

            if (!utils.isEmpty(clientData.pin)) {
                updates.pin = clientData.pin;
            }

            if (!utils.isEmpty(clientData.address)) {
                updates.address = clientData.address;
            }

            const updatedClient: IClient = await clientRepository.updateClient(query, updates);

            return Promise.resolve(updatedClient);
        } catch (exception) {
            return Promise.reject(exception);
        }
    }

    public async deleteClient(id: number): Promise<any> {
        try {
            const deletedRows = await clientRepository.delteClient(id);
            return Promise.resolve(deletedRows);
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
}

export const clientService = ClientService.getInstance();