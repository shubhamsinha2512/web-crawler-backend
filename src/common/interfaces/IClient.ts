export interface IClient {
    id: number;
    score?: number;
    name: string;
    Roc: string;
    companyStatus: string;
    companyActivity: string;
    registrationDate: string;
    category: string;
    subCategory: string;
    companyClass: string;
    state: string;
    country: string;
    email: string;
    cin: string;
    pin: string;
    address: string;
    link: string;
}

export interface IClientDto {
    id: number;
    score?: number;
    name: string;
    Roc: string;
    companyStatus: string;
    companyActivity: string;
    registrationDate: string;
    category: string;
    subCategory: string;
    companyClass: string;
    state: string;
    country: string;
    email: string;
    cin: string;
    pin: string;
    address: string;
    link: string;
}