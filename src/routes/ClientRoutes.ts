import { Router } from "express";

export class ClientRoutes {

    private constructor() { }
    private static instance: ClientRoutes;
    public router: Router = Router();

    public static getInstance(): ClientRoutes {
        if (!ClientRoutes.instance) {
            ClientRoutes.instance = new ClientRoutes();
        }
        return ClientRoutes.instance;
    }
}