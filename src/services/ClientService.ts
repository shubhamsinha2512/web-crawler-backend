import { IClientDto } from "../common/interfaces/IClient";
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

    public async saveClient(client: IClientDto): Promise<IClientDto> {
        try {
            const savedClient = await clientRepository.saveClient(client);

            return Promise.resolve(savedClient);
        } catch (exception) {
            return Promise.reject(exception);
        }
    }
}

const clientService = ClientService.getInstance();