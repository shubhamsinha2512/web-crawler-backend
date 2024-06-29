import { Request, Response, Router } from "express";
import { ClientRoutes } from "./ClientRoutes";

class Routes {

    public static getInstance(app: Router): Routes {
        if (!Routes.instance) {
            Routes.instance = new Routes(app);
        }
        return Routes.instance;
    }

    private static instance: Routes;

    public router: Router = Router();
    public clientRoutes: ClientRoutes;
    private baseRoute = "/v1";
    private constructor(app: Router) {

        this.clientRoutes = ClientRoutes.getInstance();
        this.index(app);
    }

    public index(app: Router): void {

        this.router.get(`${this.baseRoute}/serverHealth`, (req: Request, res: Response) => {
            res.status(200).send({ data: "Server Health - OK" });
        });

        this.initClientRoutes(app);

        this.router.get("/", (req: Request, res: Response) => {
            res.status(200).send({ data: "OK" });
        });
    }

    private initClientRoutes(app: Router): void {
        app.use(`${this.baseRoute}`, this.clientRoutes.router);
    }
}

export { Routes };
