class Utils {

    public static getInstance(): Utils {
        if (!Utils.instance) {
            Utils.instance = new Utils();
        }
        return Utils.instance;
    }

    private static instance: Utils;
    private constructor() { }

    public isEmpty(data: any, zeroIsNotEmpty: boolean = false): boolean {

        if (typeof data !== "object" && (data === null || data === "" || data === undefined || typeof data === "undefined")) {
            return true;
        } else if (data === null) {
            return true;
        } else if (typeof data === "string" && data === "0" && !zeroIsNotEmpty) {
            return true;
        } else if (typeof data.length !== "undefined") {
            if (data.length > 0) {
                return false;
            } else {
                return true;
            }
        } else {
            if (Object.keys(data).length > 0) {
                return false;
            } else if (typeof data === "number" && (data !== 0 || zeroIsNotEmpty)) {
                return false;
            } else if (data instanceof Map && (data.size > 0)) {
                return false;
            } else {
                if (data === true) {
                    return false;
                }
                return true;
            }
        }
    }

    public isSet(data: any): boolean {
        return typeof data !== "undefined";
    }
}

export const utils = Utils.getInstance();
