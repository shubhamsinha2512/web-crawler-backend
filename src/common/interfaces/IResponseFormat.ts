export interface ISuccessResponseFormat {
    status: number;
    message: string;
    body: any;
}

export interface IErrorResponseBodyOptionalParams {
    errCategory?: string;
    planId?: string;
    proposalStatus?: number;
}

export interface IErrorResponseBody extends IErrorResponseBodyOptionalParams {
    code: string;
    message: string;
    detail: string;
}

export interface IErrorResponseFormat {
    status: number;
    body: IErrorResponseBody[];
}
