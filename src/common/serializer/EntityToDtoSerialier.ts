import { IClient, IClientDto } from "../interfaces/IClient";

export class EntityToDtoSerializer {

    public static serializeClientEntityToDto(client: IClient): IClientDto {
        const clientDto: IClientDto = {
            id: client.id,
            score: client.score ? Number((client.score)?.toFixed(4)) : undefined,
            name: client.name,
            Roc: client.Roc,
            companyStatus: client.companyStatus,
            companyActivity: client.companyActivity,
            cin: client.cin,
            registrationDate: client.registrationDate,
            category: client.category,
            subCategory: client.subCategory,
            companyClass: client.companyClass,
            email: client.email,
            state: client.state,
            pin: client.pin,
            country: client.country,
            address: client.address,
            link: client.link,
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
