import voca from "voca";
import { IErrorResponseBody, IErrorResponseBodyOptionalParams, IErrorResponseFormat, ISuccessResponseFormat } from "../interfaces/IResponseFormat";
import { utils } from "./utils";

class ResponseFormatter {

    public static getInstance(): ResponseFormatter {
        if (!ResponseFormatter.instance) {
            ResponseFormatter.instance = new ResponseFormatter();
        }
        return ResponseFormatter.instance;
    }

    private static instance: ResponseFormatter;
    private constructor() { }

    public getSuccessResponse(httpSuccessCode: number, message: string, responseObject: any = {}): ISuccessResponseFormat {

        const returnSuccessObject: ISuccessResponseFormat = {
            status: 200, message: "", body: {},
        };

        returnSuccessObject.status = httpSuccessCode;
        returnSuccessObject.message = message;
        returnSuccessObject.body = responseObject;

        return returnSuccessObject;
    }

    /**
     *
     * @param code
     * @param message
     * @param detail
     * @param options
     */
    public getErrorResponseBody(code: string, message: string, detail: string = "", options: IErrorResponseBodyOptionalParams = {}): IErrorResponseBody {

        const errorObject: IErrorResponseBody = {
            code: "", message: "", detail: "",
        };

        errorObject.code = code;
        errorObject.message = voca.replaceAll(message, "\"", "'");
        errorObject.detail = detail ? voca.replaceAll(detail, "\"", "'") : errorObject.message;
        errorObject.errCategory = "";

        if (utils.isSet(options.errCategory)) {
            errorObject.errCategory = options.errCategory;
        }
        if (utils.isSet(options.planId)) {
            errorObject.planId = options.planId;
        }
        if (utils.isSet(options.proposalStatus)) {
            errorObject.proposalStatus = options.proposalStatus;
        }

        // cl(errorObject,__line,__file);
        return errorObject;
    }

    /**
     * @returns IErrorResponseFormat
     * @param httpErrorCode number
     * @param errorObject IErrorResponseBody
     */
    public getErrorResponse(httpErrorCode: number, errorObject: IErrorResponseBody): IErrorResponseFormat {

        const returnErrorObject: IErrorResponseFormat = {
            status: 0, body: [],
        };
        let errorArray: IErrorResponseBody[] = [];

        if (Array.isArray(errorObject)) {
            errorArray = errorObject;
        } else {
            errorArray.push(errorObject);
        }

        returnErrorObject.status = httpErrorCode;
        returnErrorObject.body = errorArray;

        return returnErrorObject;
    }

    public getErrorResponseWithBody(httpErrorCode: number, code: string, message: string, detail: string = "", options: IErrorResponseBodyOptionalParams = {}): IErrorResponseFormat {

        const errorObject = this.getErrorResponseBody(code, message, detail, options);
        return this.getErrorResponse(httpErrorCode, errorObject);
    }

    public formatValidationErrorMsg(errors: any, errCode: string) {

        const errorObject: any = [];
        if (!utils.isEmpty(errors)) {

            console.error("errors:- %o", errors);
            errors.forEach((element: any, counter: number) => {
                const errCodeT = errCode + (counter + 1);
                errorObject.push(this.getErrorResponseBody(errCodeT, element.message, ""));
            });
        }

        const finalErr = this.getErrorResponse(400, errorObject);
        console.error("finalErr:- %o", finalErr);
        return finalErr;
    }
}

export const responseFormatter = ResponseFormatter.getInstance();
