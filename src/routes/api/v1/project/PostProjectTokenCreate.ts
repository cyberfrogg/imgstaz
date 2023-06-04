import { Express, Request, Response } from "express";
import IRoute from "../../../../services/routes/IRoute";
import ReqResponse from '../../../../utils/ReqResponse';
import IDatabaseService from "../../../../services/database/IDatabaseService";
import { STATUS_ACCESS_DENIED, STATUS_INVALID_FIELDS, STATUS_NOT_FOUND, STATUS_UNKNOWN_ERROR } from "../../../../utils/statusCodes";
import { generateRandomString, hashString, hashStringWithSalt } from "../../../../utils/stringutils";
import SaltValuePair from "../../../../utils/SaltValuePair";
import ILoggerService from '../../../../services/logger/ILoggerService';

class PostProjectTokenCreate implements IRoute {
    readonly path: string;

    private readonly database: IDatabaseService;
    private readonly projectCreateTokenServiceToken: string = process.env.PROJECT_CREATE_TOKEN_SERVICE_TOKEN as string;
    private readonly uuidLength: number = Number(process.env.CONFIG_UUID_LENGTH);
    private readonly logger: ILoggerService;


    constructor(path: string, database: IDatabaseService, logger: ILoggerService) {
        this.path = path;
        this.database = database;
        this.logger = logger;
    }

    async initialize(expressApp: Express): Promise<void> {
        expressApp.post(this.path, this.execute);
    }

    execute = async (req: Request, res: Response) => {
        const serviceTokenReq = req.body.serviceToken;
        const projectUuidReq = req.body.projectUuid;

        // validate fields
        const areFieldsValid = this.areFieldsValid(serviceTokenReq, projectUuidReq);
        if (!areFieldsValid) {
            res.status(STATUS_INVALID_FIELDS);
            res.json(ReqResponse.Fail("ERRCODE_INVALID_FIELDS"));
            return;
        }

        // validate service token
        if (serviceTokenReq != this.projectCreateTokenServiceToken) {
            res.status(STATUS_ACCESS_DENIED);
            res.json(ReqResponse.Fail("ERRCODE_ACCESS_DENIED"));
            return;
        }

        // get project by requested uuid
        const getProjectResponse = await this.database.tableProjects.GetByUuid(projectUuidReq);
        if (!getProjectResponse.success) {
            res.status(STATUS_NOT_FOUND);
            res.json(ReqResponse.Fail("ERRCODE_PROJECT_NOT_FOUND"));
            return;
        }

        // get new row uuid
        const nextRowUUidResponse = await this.database.GetNextUuid();
        if (!nextRowUUidResponse.success) {
            res.status(STATUS_UNKNOWN_ERROR);
            res.json(ReqResponse.Fail("ERRCODE_UNKNOWN"));
            return;
        }

        // generate project token
        // this token is random but I want to make sure token will not repeat itself, so I add project uuid
        const projectToken = hashString(getProjectResponse.data.uuid + generateRandomString(100));  // generate token

        const createResponse = await this.database.tableProjectTokens.Create(
            nextRowUUidResponse.data,
            getProjectResponse.data.uuid,
            projectToken
        );
        if (!createResponse.success) {
            this.logger.error("Failed to create new project token. Message: " + createResponse.message);
            res.status(STATUS_UNKNOWN_ERROR);
            res.json(ReqResponse.Fail("ERRCODE_UNKNOWN"));
            return;
        }

        res.json(ReqResponse.Success(createResponse.data));
        return;
    }

    areFieldsValid = (serviceToken: string, projectUuid: string): boolean => {
        try {
            if (serviceToken == null || serviceToken == undefined || serviceToken == "" || serviceToken.length == 0) {
                return false;
            }

            if (projectUuid == null || projectUuid == undefined || projectUuid == "" || projectUuid.length != this.uuidLength) {
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