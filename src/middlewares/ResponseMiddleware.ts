import { NextFunction, Request, Response } from "express";
import { utils } from "../common/utils/utils";
import { responseFormatter } from "../common/utils/ResponseFormatter";

class ResponseMiddleware {

    public static getInstance(): ResponseMiddleware {
        if (!ResponseMiddleware.instance) {
            ResponseMiddleware.instance = new ResponseMiddleware();
        }
        return ResponseMiddleware.instance;
    }

    private static instance: ResponseMiddleware;
    private constructor() { }

    public sendResponse(response: { isSuccess: boolean, data: any, statusCode: number }, req: Request, res: Response, next: NextFunction) {
        if (response.isSuccess) {
            ResponseMiddleware.getInstance().success(req, res, response.data, false, response.statusCode);
        } else {
            ResponseMiddleware.getInstance().fail(req, res, response.data, response.statusCode);
        }
    }

    public success(req: Request, res: Response, data: any, sendRaw: boolean = false, statusCode: number) {

        let httpStatusCode: number = statusCode;

        if (sendRaw) {
            return res.status(httpStatusCode).send(data);
        } else {
            res.status(httpStatusCode).send({ data });
        }

    }

    public fail(req: Request, res: Response, error: any, statusCode: number) {

        let data: any;
        let status: number;

        try {
            if (!utils.isEmpty(error) && !utils.isEmpty(error.status)) {
                data = error.body;
                status = error.status;
            } else {
                const errResponse: any = responseFormatter.getErrorResponseWithBody(statusCode, "RF002", "Something Went Wrong");
                data = errResponse.body;
                status = errResponse.status;
            }
        } catch (err) {
            console.error("%o", err);
            const errResponse: any = responseFormatter.getErrorResponseWithBody(statusCode, "RF003", "Something Went Wrong");
            data = errResponse.body;
            status = errResponse.status;
        }

        res.status(status).send({ errors: data });
    }
}

export const responseMiddleware = ResponseMiddleware.getInstance();
