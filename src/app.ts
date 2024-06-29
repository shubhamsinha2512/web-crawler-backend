'use strict';

import express from 'express';
import { Routes } from './routes/Routes';

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

    private initRoutes(): void {

        const routes = Routes.getInstance(this.app);
        this.app.use(routes.router);
    }

    private bootstrap(): void {

        this.initRoutes();
    }
}