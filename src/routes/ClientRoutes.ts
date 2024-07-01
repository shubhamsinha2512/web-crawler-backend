import { NextFunction, Request, Response, Router } from "express";
import { clientService } from '../services/ClientService'

export class ClientRoutes {

    private static instance: ClientRoutes;
    public router: Router = Router();

    public static getInstance(): ClientRoutes {
        if (!ClientRoutes.instance) {
            ClientRoutes.instance = new ClientRoutes();
        }
        return ClientRoutes.instance;
    }

    private constructor() {
        this.index();
    }

    private index(): void {

        this.router.post('/clients', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const client = req.body;
                const response = await clientService.saveClient(client);
                next({ isSuccess: true, data: response, statusCode: 201 });
            } catch (exception) {
                next({ isSuccess: false, data: exception, statusCode: 500 });
            }
        })

        this.router.get('/clients', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const query = req.query;
                const response = await clientService.getClients(query);
                next({ isSuccess: true, data: response, statusCode: 200 });
            } catch (exception) {
                next({ isSuccess: false, data: exception, statusCode: 404 });
            }
        })

        this.router.get('/clients/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const id = Number(req?.params?.id);
                const response = await clientService.getClientById(id);
                next({ isSuccess: true, data: response, statusCode: 200 });
            } catch (exception) {
                next({ isSuccess: false, data: exception, statusCode: 404 });
            }
        })

        this.router.put('/clients/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const id = Number(req?.params?.id);
                const updates = req.body;
                const response = await clientService.updateClient(id, updates);
                next({ isSuccess: true, data: response, statusCode: 201 });
            } catch (exception) {
                next({ isSuccess: false, data: exception, statusCode: 500 });
            }
        })

        this.router.delete('/clients/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const id = Number(req?.params?.id);
                const updates = req.body;
                const response = await clientService.deleteClient(id);
                next({ isSuccess: true, data: response, statusCode: 200 });
            } catch (exception) {
                next({ isSuccess: false, data: exception, statusCode: 500 });
            }
        })

        this.router.get('/clients-sync', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const response = await clientService.syncSqlDBToElastic();
                next({ isSuccess: true, data: response, statusCode: 201 });
            } catch (exception) {
                next({ isSuccess: false, data: exception, statusCode: 500 });
            }
        })
    }
}