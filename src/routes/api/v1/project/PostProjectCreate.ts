import { Express, Request, Response } from "express";
import IRoute from "../../../../services/routes/IRoute";
import ReqResponse from '../../../../utils/ReqResponse';
import IDatabaseService from "../../../../services/database/IDatabaseService";
import { STATUS_ACCESS_DENIED, STATUS_INVALID_FIELDS, STATUS_NOT_FOUND, STATUS_UNKNOWN_ERROR } from "../../../../utils/statusCodes";
import ILoggerService from '../../../../services/logger/ILoggerService';
import RangeVal from '../../../../utils/RangeVal';

class PostProjectCreate implements IRoute {
    readonly path: string;

    private readonly database: IDatabaseService;
    private readonly projectCreateTokenServiceToken: string = process.env.PROJECT_CREATE_TOKEN_SERVICE_TOKEN as string;
    private readonly logger: ILoggerService;
    private readonly projectNameRange: RangeVal = new RangeVal(Number(process.env.PROJECT_NAME_LEN_MIN), Number(process.env.PROJECT_NAME_LEN_MAX));


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
        const projectNameReq = req.body.projectName;

        // validate fields
        const areFieldsValid = this.areFieldsValid(serviceTokenReq, projectNameReq);
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

        // get new row uuid
        const nextRowUUidResponse = await this.database.GetNextUuid();
        if (!nextRowUUidResponse.success) {
            res.status(STATUS_UNKNOWN_ERROR);
            res.json(ReqResponse.Fail("ERRCODE_UNKNOWN"));
            return;
        }

        // create project
        const createResponse = await this.database.tableProjects.Create(nextRowUUidResponse.data, projectNameReq);
        if (!createResponse.success) {
            this.logger.error("Failed to create new project. Message: " + createResponse.message);
            res.status(STATUS_UNKNOWN_ERROR);
            res.json(ReqResponse.Fail("ERRCODE_UNKNOWN"));
            return;
        }

        res.json(ReqResponse.Success(createResponse.data));
        return;
    }

    areFieldsValid = (serviceToken: string, projectName: string): boolean => {
        try {
            if (serviceToken == null || serviceToken == undefined || serviceToken == "" || serviceToken.length == 0) {
                return false;
            }

            if (projectName == null || projectName == undefined || projectName == "") {
                return false;
            }

            if (!this.projectNameRange.isStringInRange(projectName)) {
                return false;
            }

            return true;
        }
        catch {
            return false;
        }
    }
}

export default PostProjectCreate;