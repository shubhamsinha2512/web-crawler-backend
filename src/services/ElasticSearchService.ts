import { Client, errors } from '@elastic/elasticsearch';
import { ELASTIC_SEARCH_CONN_URL } from '../common/configs/configs'
import { IClientDto } from '../common/interfaces/IClient';

class ElasticSearchService {
    private static instance: ElasticSearchService;
    private constructor() { }

    public static elasticClient: Client = new Client({
        node: ELASTIC_SEARCH_CONN_URL,
    })
    public static getInstance(): ElasticSearchService {
        if (!ElasticSearchService.instance) {
            ElasticSearchService.instance = new ElasticSearchService();
        }
        return ElasticSearchService.instance;
    }

    public async createIndex(indexName: string, settings: any) {
        try {
            const exists = await ElasticSearchService.elasticClient.indices.exists({ index: indexName });
            if (!exists) {
                const response = await ElasticSearchService.elasticClient.indices.create({
                    index: indexName,
                    body: settings,
                });

                return Promise.resolve(response);
            } else {
                return Promise.resolve({ acknowledged: true, message: 'Index already exists.' });
            }
        } catch (exception) {
            return Promise.reject(exception);
        }
    }

    public async deleteIndex(indexName: string) {
        try {
            const exists = await ElasticSearchService.elasticClient.indices.exists({ index: indexName });
            if (exists) {
                const response = await ElasticSearchService.elasticClient.indices.delete({ index: indexName });
                return Promise.resolve(response);
            } else {
                return Promise.resolve({ acknowledged: true, message: 'Index does not exist.' });
            }
        } catch (exception) {
            return Promise.reject(exception);
        }
    }

    public async createDocument(indexName: string, document: any) {
        try {
            const response = await ElasticSearchService.elasticClient.index({
                index: indexName,
                id: document.id.toString(),
                body: document,
            });

            return Promise.resolve(response);
        } catch (exception) {
            return Promise.reject(exception);
        }
    }

    public async readDocuments(indexName: string, query: any) {
        try {
            const response = await ElasticSearchService.elasticClient.search({
                index: indexName,
                body: {
                    query: {
                        match_all: query,
                    }
                },
            });

            return Promise.resolve(response);
        } catch (exception) {
            return Promise.reject(exception);
        }
    }

    async freeTextSearch(indexName: string, searchTerm: string, fields: string[]) {
        try {
            const foundDocuments = await ElasticSearchService.elasticClient.search({
                index: indexName,
                body: {
                    query: {
                        query_string: {
                            query: `*${searchTerm}*`
                        }
                    },
                },
            });

            const response = foundDocuments.hits.hits.map(hit => hit._source);
            return Promise.resolve(response);
        } catch (error) {
            console.error('Error performing free text search:', error);
            return Promise.resolve([]);
        }
    }

    public async updateDocument(indexName: string, id: string, document: IClientDto) {
        try {
            const response = await ElasticSearchService.elasticClient.update({
                index: indexName,
                id: id,
                body: {
                    doc: document,
                },
            });

            return Promise.resolve(response);
        } catch (exception) {
            return Promise.reject(exception);
        }
    }

    public async deleteDocuments(indexName: string, query: any) {
        try {
            const response = await ElasticSearchService.elasticClient.deleteByQuery({
                index: indexName,
                body: {
                    query: {
                        match_all: query,
                    }
                },
            });

            return Promise.resolve(response);
        } catch (exception) {
            return Promise.reject(exception);
        }
    }

    async bulkCreate(indexName: string, documents: IClientDto[]) {
        try {
            const bulkOps: any[] = [];

            documents.forEach((doc: IClientDto) => {
                bulkOps.push({ index: { _index: indexName, _id: doc.id } });
                bulkOps.push(doc);
            });

            const response = await ElasticSearchService.elasticClient.bulk({ body: bulkOps });

            if (response.errors) {
                console.error('Bulk operation had errors:', errors);
                return { success: false, errors: errors };
            }

            return Promise.resolve({ success: true, items: response.items });
        } catch (error) {
            return Promise.reject({ success: false, error });
        }
    }
}

export const elasticSearchService = ElasticSearchService.getInstance();