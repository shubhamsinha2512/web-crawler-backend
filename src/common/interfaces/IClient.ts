export interface IClient {
    id: number;
    score?: number;
    name: string;
    email: string;
    cin: string;
    pin: string;
    address: string;
}

export interface IClientDto {
    id: number;
    score?: number;
    name: string;
    email: string;
    cin: string;
    pin: string;
    address: string;
}