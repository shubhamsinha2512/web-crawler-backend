import { QueryTypes } from "sequelize";
import { IClient, IClientDto } from "../common/interfaces/IClient";
import Client from "../models/ClientModel";

class ClientRepository {

    constructor() { }

    private static instance: ClientRepository;
    public static getInstance(): ClientRepository {
        if (!ClientRepository.instance) {
            ClientRepository.instance = new ClientRepository();
        }

        return ClientRepository.instance;
    }

    public async saveClientBulk(clients: IClientDto[]): Promise<IClient[]> {
        try {
            console.info(`DB Call:: Bulk Save clients: ${JSON.stringify(clients)}`);
            const savedClients: IClient[] = await Client.bulkCreate(clients) as unknown as IClient[];

            return Promise.resolve(savedClients);
        } catch (exception) {
            return Promise.reject(exception);
        }
    }

    public async saveClient(client: IClientDto): Promise<IClient> {
        try {
            console.info(`DB Call:: Saving client: ${JSON.stringify(client)}`);
            const savedClient: IClient = await Client.create(client) as unknown as IClient;

            return Promise.resolve(savedClient);
        } catch (exception) {
            return Promise.reject(exception);
        }
    }

    public async getClients(query: any): Promise<IClient[]> {
        try {
            console.info(`DB Call:: Get clients query: ${JSON.stringify(query)}`);
            const clients: IClient[] = await Client.findAll({ where: query }) as unknown as IClient[];

            return Promise.resolve(clients);
        } catch (exception) {
            return Promise.reject(exception);
        }
    }

    public async updateClient(query: any, updates: any): Promise<IClient> {
        try {
            console.info(`DB Call:: Update client query: ${JSON.stringify(query)} updates: ${JSON.stringify(updates)}`);
            const updateRows = await Client.update(updates, { where: query, returning: true });
            const updatedClient: IClient = await Client.findAll({ where: query }) as unknown as IClient;

            return Promise.resolve(updatedClient);
        } catch (exception) {
            return Promise.reject(exception);
        }
    }

    public async delteClient(id: number): Promise<any> {
        try {
            console.info(`DB Call:: Delete client: ${id}`);
            const updateRows = await Client.destroy({ where: { id: id } });

            return Promise.resolve(updateRows);
        } catch (exception) {
            return Promise.reject(exception);
        }
    }

    public async runQuery(query: string, select: boolean = true): Promise<any> {
        try {
            console.info(`DB Call:: Run Query: ${query}`);
            const options: any = {};

            if (select) {
                options.type = QueryTypes.SELECT
            }

            const result = await Client.sequelize?.query(query, options);

            return Promise.resolve(result);
        } catch (exception) {
            return Promise.reject(exception);
        }
    }
}


export const clientRepository = ClientRepository.getInstance();