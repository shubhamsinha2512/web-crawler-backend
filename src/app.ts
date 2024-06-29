'use strict';

import express from 'express';
import { Routes } from './routes/Routes';
import { responseMiddleware } from './middlewares/ResponseMiddleware';

export class App {

    public static instance: App;
    public app: express.Express;

    public static getInstance(): App {
        if (!App.instance) {
            App.instance = new App();
        }
        return App.instance;
    }

    private constructor() {
        this.app = express();
        this.bootstrap();
    }

    public initServer(port: number): void {
        this.app.listen(port, () => {
            console.info(`Server is running on http://localhost:${port}`);
        })
    }

    private initBodyParser(): void {

        // Url Encoded Data
        this.app.use(express.urlencoded({
            extended: true,
            limit: "50mb",
        }));

        // to Support JSON Encoded Bodies
        this.app.use(express.json({
            type: "application/json", limit: "50mb",
        }));
    }

    private initRoutes(): void {

        const routes = Routes.getInstance(this.app);
        this.app.use(routes.router);
    }

    private sendResponse(): void {
        this.app.use(responseMiddleware.sendResponse);
    }

    private bootstrap(): void {
        this.initBodyParser();
        this.initRoutes();
        this.sendResponse();
    }
}