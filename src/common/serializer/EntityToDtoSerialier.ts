import { IClient, IClientDto } from "../interfaces/IClient";

export class EntityToDtoSerializer {

    public static serializeClientEntityToDto(client: IClient): IClientDto {
        const clientDto: IClientDto = {
            id: client.id,
            score: client.score ? Number((client.score)?.toFixed(4)) : undefined,
            name: client.name,
            email: client.email,
            cin: client.cin,
            pin: client.pin,
            address: client.address
        };

        return clientDto;;
    }

    public static serializeMultipleClientEntityToDto(clients: IClient[]): IClientDto[] {
        const clientsDto: IClientDto[] = [];

        for (const client of clients) {
            clientsDto.push(this.serializeClientEntityToDto(client));
        }

        return clientsDto;
    }
}
