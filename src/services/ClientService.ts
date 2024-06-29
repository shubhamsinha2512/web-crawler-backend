import { IClient, IClientDto } from "../common/interfaces/IClient";
import { EntityToDtoSerializer } from "../common/serializer/EntityToDtoSerialier";
import { utils } from "../common/utils/utils";
import { clientRepository } from "../repositories/ClientRepository";

class ClientService {
    private constructor() { }
    private static instance: ClientService;

    public static getInstance(): ClientService {
        if (!ClientService.instance) {
            ClientService.instance = new ClientService();
        }
        return ClientService.instance;
    }

    public async getClients(query: any): Promise<IClientDto | IClientDto[]> {
        try {
            let clients: IClient[] = [] as IClient[];

            if (!utils.isEmpty(query.q)) {
                // Free Text Search
                const searchTerm = query.q;

                const SQLQuery = `SELECT MATCH(name, email, cin, pin, address) AGAINST('*${searchTerm}*' IN BOOLEAN MODE) as score, clients.* 
                    FROM clients WHERE MATCH(name, email, cin, pin, address) AGAINST('*${searchTerm}*' IN BOOLEAN MODE) ORDER BY score DESC;`;
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
}

export const clientService = ClientService.getInstance();