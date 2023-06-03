import { Express, Request, Response } from "express";
import IRoute from "../../../../services/routes/IRoute";
import ReqResponse from '../../../../utils/ReqResponse';
import IDatabaseService from "../../../../services/database/IDatabaseService";
import { STATUS_ACCESS_DENIED, STATUS_INVALID_FIELDS } from "../../../../utils/statusCodes";

class PostProjectTokenCreate implements IRoute {
    readonly path: string;

    private readonly database: IDatabaseService;
    private readonly projectCreateTokenServiceToken: string = process.env.PROJECT_CREATE_TOKEN_SERVICE_TOKEN as string;
    private readonly uuidLength: number = Number(process.env.CONFIG_UUID_LENGTH);


    constructor(path: string, database: IDatabaseService) {
        this.path = path;
        this.database = database;
    }

    async initialize(expressApp: Express): Promise<void> {
        expressApp.post(this.path, this.execute);
    }

    execute = async (req: Request, res: Response) => {
        const serviceTokenReq = req.body.serviceToken;
        const projectUuidReq = req.body.projectUuid;

        const areFieldsValid = this.areFieldsValid(serviceTokenReq, projectUuidReq);
        if (!areFieldsValid) {
            res.status(STATUS_INVALID_FIELDS);
            res.json(ReqResponse.Fail("ERRCODE_INVALID_FIELDS"));
            return;
        }

        if (serviceTokenReq != this.projectCreateTokenServiceToken) {
            res.status(STATUS_ACCESS_DENIED);
            res.json(ReqResponse.Fail("ERRCODE_ACCESS_DENIED"));
            return;
        }


        res.json(ReqResponse.Success());
    }

    areFieldsValid = (serviceToken: string, projectUuid: string): boolean => {
        try {
            if (serviceToken == null || serviceToken == undefined || serviceToken == "" || serviceToken.length == 0) {
                return false;
            }

            if (projectUuid == undefined || projectUuid == null || projectUuid == "" || projectUuid.length != this.uuidLength) {
                return false;
            }

            return true;
        }
        catch {
            return false;
        }
    }
}

export default PostProjectTokenCreate;