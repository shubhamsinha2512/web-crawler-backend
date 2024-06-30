import { NextFunction, Request, Response, Router } from "express";
import { crawlService } from "../services/CrawlerService";

export class CrawlRoutes {

    private static instance: CrawlRoutes;
    public router: Router = Router();

    public static getInstance(): CrawlRoutes {
        if (!CrawlRoutes.instance) {
            CrawlRoutes.instance = new CrawlRoutes();
        }
        return CrawlRoutes.instance;
    }

    private constructor() {
        this.index();
    }

    private index(): void {

        this.router.get('/web-cralwer', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const url: string = req.query.startUrl as string;
                const truncateOldData: string = req.query.truncatePrevious as string;
                const response = await crawlService.crwaler(url, truncateOldData);
                next({ isSuccess: true, data: response, statusCode: 201 });
            } catch (exception) {
                next({ isSuccess: false, data: exception, statusCode: 500 });
            }
        })
    }
}