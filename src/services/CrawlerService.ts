import cheerio from "cheerio";
import { IClient, IClientDto } from "../common/interfaces/IClient";
import { utils } from "../common/utils/utils";
import axios from "axios";
import { clientService } from "./ClientService";

class ClientService {
    private constructor() { }
    private static instance: ClientService;

    public static getInstance(): ClientService {
        if (!ClientService.instance) {
            ClientService.instance = new ClientService();
        }
        return ClientService.instance;
    }
    private sanitiseExtarctedValues(value: string): string {
        return value?.trim().replace(/[",]/g, '');
    }

    public static FIELD_MAP: any = {
        "name": "Company Name",
        "Roc": "RoC",
        "companyStatus": "Company Status",
        "companyActivity": "Company Activity",
        "cin": "CIN",
        "registrationDate": "Registration Date",
        "category": "Category",
        "subCategory": "Sub Category",
        "companyClass": "Company Class",
        "state": "State",
        "pin": "PIN Code",
        "country": "Country",
        "address": "Address",
        "email": "Email",
    }

    public async crwaler(startUrl: string, truncateOldDate: string): Promise<IClientDto[]> {
        try {
            if (truncateOldDate === 'true') {
                await clientService.truncateOldDate();
            }

            console.log(`Recievd URL to Crwaler: ${startUrl}`);

            const domainUrl = this.getDomain(startUrl);
            const html = await this.getHtml(startUrl);

            const $ = cheerio.load(html);
            const links: string[] = $("a").toArray()
                .map(link => $(link).attr("href"))
                .filter(link => link?.startsWith('/company')) as string[];

            const savedClients: IClientDto[] = await this.startCrawler(domainUrl, links) as IClientDto[];
            return Promise.resolve(savedClients);
        } catch (exception) {
            return Promise.reject(exception);
        }
    }

    private async startCrawler(domain: string, links: string[]) {
        try {
            const data: IClientDto[] = [];
            const visitedLinks: string[] = [];

            for (let link of links) {
                const completeUrl = `${domain}${link}`
                const normalizedUrl = this.normalizeUrl(completeUrl);

                if (visitedLinks.includes(normalizedUrl)) {
                    console.warn(`Link already visited: ${normalizedUrl}`);
                    continue;
                }

                visitedLinks.push(normalizedUrl);

                const extractedData = await this.extractClientData(normalizedUrl);
                const clientData: IClientDto = this.convertToClientData(extractedData!);
                clientData.link = completeUrl;

                try {
                    const existingClient = await clientService.getClients({ link: completeUrl });

                    if (utils.isEmpty(existingClient)) {
                        const savedClientsDto: IClientDto = await clientService.saveClient(clientData) as IClientDto;
                        data.push(savedClientsDto);
                    }
                } catch (exception) {
                    console.log(`Error while saving client: ${JSON.stringify(clientData)}`);
                }
            }

            return Promise.resolve(data);
        } catch (exception) {

        }
    }

    private normalizeUrl(url: string): string {
        const urlObject: URL = new URL(url);
        const normalizedUrl: string = `${urlObject.protocol}//${urlObject.hostname}${urlObject.pathname}`;

        if (normalizedUrl.length > 0 && normalizedUrl.slice(-1) === "/") {
            return normalizedUrl.slice(0, -1);
        }

        console.info(`Normalized URL: ${normalizedUrl}`);
        return normalizedUrl;
    }

    private getDomain(url: string): string {
        const urlObject: URL = new URL(url);
        const domain: string = `${urlObject.protocol}//${urlObject.hostname}`;

        if (domain.length > 0 && domain.slice(-1) === "/") {
            return domain.slice(0, -1);
        }

        console.info(`Domain: ${domain}`);
        return domain;
    }

    private async getHtml(url: string) {
        try {
            console.info(`Gettingn HTML: ${url}`);
            const response = await axios.get(url);
            const html = response.data;

            return Promise.resolve(html);
        } catch (exception) {

        }
    }

    private async extractClientData(url: any): Promise<any> {
        console.info(`Starting Data Extraction for link: ${url}`);

        const ClientData: any = {};
        const html = await this.getHtml(url);
        const companyDataHTML = cheerio.load(html);

        const companyBasicDetails = companyDataHTML('div#basicdetails').toArray();
        const companyContactDetails = companyDataHTML('div#CONTACT-DETAILS').toArray();

        const basicData = cheerio.load(companyBasicDetails);
        const contactData = cheerio.load(companyContactDetails);
        const basicDataRows = basicData('div.row').toArray();
        const constactDataRows = contactData('div.row').toArray();

        //Extract Basic Data
        for (const row of basicDataRows) {
            const feildsName = cheerio.load(row)('div.col-xl-3.col-6 > a').text().trim();
            const feildsValue = cheerio.load(row)('div.col-xl-9.col-6 > h6').text().trim();

            if (!utils.isEmpty(feildsName) && !utils.isEmpty(feildsValue)) {
                const key = this.sanitiseExtarctedValues(feildsName);
                const value = this.sanitiseExtarctedValues(feildsValue);

                ClientData[key] = value;
            }
        }

        //Extract Contact Data
        for (const row of constactDataRows) {
            const feildsName = cheerio.load(row)('div.col-xl-4.col-6 > a').text().trim();
            const feildsValue = cheerio.load(row)('div.col-xl-8.col-6 > h6').text().trim();

            if (!utils.isEmpty(feildsName) && !utils.isEmpty(feildsValue)) {
                const key = this.sanitiseExtarctedValues(feildsName);
                const value = this.sanitiseExtarctedValues(feildsValue);

                ClientData[key] = value;
            }
        }

        return ClientData;
    }

    private convertToClientData(extractedData: any[]): IClientDto {
        const clientDto: any = {};

        for (const [key, value] of Object.entries(ClientService.FIELD_MAP)) {
            clientDto[key] = (extractedData! as any)[value as string];
        }


        return clientDto;
    }
}

export const crawlService = ClientService.getInstance();