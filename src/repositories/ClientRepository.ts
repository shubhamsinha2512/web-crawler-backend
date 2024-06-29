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

    public async saveClient(client: IClientDto): Promise<IClient> {
        try {
            console.info(`Saving client: ${JSON.stringify(client)}`);
            const savedClient = await Client.create(client) as unknown as IClient;

            return Promise.resolve(client);
        } catch (exception) {
            return Promise.reject(exception);
        }
    }
}


export const clientRepository = ClientRepository.getInstance();