import { IClient, IClientDto } from "../common/interfaces/IClient";
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
            let foundClients: IClientDto | IClientDto[] = {} as IClientDto | IClientDto[];
            const clients = await clientRepository.getClients(query);

            return Promise.resolve(clients);
        } catch (exception) {
            return Promise.reject(exception);
        }
    }

    public async getClientById(id: number): Promise<IClientDto> {
        try {
            const query = { id: id };

            const clients = await clientRepository.getClients(query);
            let foundClient: IClientDto = clients?.[0] || {} as IClientDto;

            return Promise.resolve(foundClient);
        } catch (exception) {
            return Promise.reject(exception);
        }
    }


    public async saveClient(clientsData: IClientDto | IClientDto[]): Promise<IClientDto | IClientDto[]> {
        try {
            const clients: IClientDto[] = [] as IClientDto[];
            let savedClients: IClientDto | IClientDto[] = {} as IClientDto | IClientDto[];

            if (Array.isArray(clientsData)) {
                clients.push(...clientsData);
                savedClients = await clientRepository.saveClientBulk(clients);
            } else {
                savedClients = await clientRepository.saveClient(clientsData);
            }

            return Promise.resolve(savedClients);
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
            const query = { id: id };
            const deletedRows = await clientRepository.delteClient(id);
            return Promise.resolve(deletedRows);
        } catch (exception) {
            return Promise.reject(exception);
        }
    }
}

export const clientService = ClientService.getInstance();