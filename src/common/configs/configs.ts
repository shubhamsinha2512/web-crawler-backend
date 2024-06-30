import * as dotenv from "dotenv";
import dotenvParseVariables from "dotenv-parse-variables";

dotenv.config();
const parsedVariables: any = dotenvParseVariables(process?.env as dotenvParseVariables.Parsed);

//Application Config
export const PORT: number = parsedVariables.PORT;

//Database Config
export const SQL_HOST: string = parsedVariables.SQL_HOST;
export const SQL_USERNAME: string = parsedVariables.SQL_USERNAME;
export const SQL_PASSWORD: string = parsedVariables.SQL_PASSWORD;
export const SQL_DATABASE: string = parsedVariables.SQL_DATABASE;

//ElasticSearch Config
export const ELASTIC_SEARCH_CONN_URL: string = parsedVariables.ELASTIC_SEARCH_CONN_URL;
export const ELASTIC_SEARCH_API_KEY: string = parsedVariables.ELASTIC_SEARCH_API_KEY;