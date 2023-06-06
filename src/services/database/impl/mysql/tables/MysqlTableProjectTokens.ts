import ReqResponse from '../../../../../utils/ReqResponse';
import ILoggerService from '../../../../logger/ILoggerService';
import RowProjectToken from '../../../rows/RowProjectToken';
import IDatabaseTableProjectTokens from '../../../tables/IDatabaseTableProjectTokens';
import MysqlDatabaseExecutor from '../MysqlDatabaseExecutor';

class MysqlTableProjectTokens implements IDatabaseTableProjectTokens {
    private readonly logger: ILoggerService;
    private readonly executor: MysqlDatabaseExecutor;
    private readonly columns: string[] = ["uuid", "projectuuid", "token", "create_time"];

    constructor(executor: MysqlDatabaseExecutor, logger: ILoggerService) {
        this.logger = logger;
        this.executor = executor;
    }

    Create = async (newRowUuid: string, projectUuid: string, token: string): Promise<ReqResponse<RowProjectToken>> => {
        try {
            const queryResponse = await this.executor.query(
                `INSERT INTO projecttokens
                (uuid, projectuuid, token)
                VALUES (?, ?, ?)`,
                [newRowUuid, projectUuid, token]
            );

            if (!queryResponse.success) {
                return ReqResponse.Fail("ERRCODE_UNKNOWN");
            }

            const getResponse = await this.GetByUuid(newRowUuid);
            if (!getResponse.success) {
                return ReqResponse.Fail(getResponse.message);
            }

            return ReqResponse.Success(getResponse.data);
        }
        catch (e) {
            this.logger.error(e);
            return ReqResponse.Fail("ERRCODE_UNKNOWN");
        }
    }
    GetByUuid = async (uuid: string): Promise<ReqResponse<RowProjectToken>> => {
        return await this.GetBy("uuid", uuid);
    }
    GetByName = async (name: string): Promise<ReqResponse<RowProjectToken>> => {
        return await this.GetBy("name", name);
    }
    GetByToken = async (token: string): Promise<ReqResponse<RowProjectToken>> => {
        return await this.GetBy("token", token);
    }
    GetBy = async (column: string, value: string): Promise<ReqResponse<any>> => {
        try {
            if (!this.IsColumnValid(column)) {
                return ReqResponse.Fail("ERRCODE_INVALID_COLUMN");
            }

            const queryResponse = await this.executor.query(
                `SELECT * FROM projecttokens WHERE ` + column + ` = ?`,
                [value]
            );

            if (!queryResponse.success || queryResponse.data.length == 0) {
                return ReqResponse.Fail("ERRCODE_NOT_FOUND");
            }

            let responseData = new RowProjectToken();
            responseData.uuid = queryResponse.data[0]["uuid"];
            responseData.projectuuid = queryResponse.data[0]["projectuuid"];
            responseData.token = queryResponse.data[0]["token"];
            responseData.create_time = new Date(queryResponse.data[0]["create_time"]);

            return ReqResponse.Success(responseData);
        }
        catch (e) {
            this.logger.error(e);
            return ReqResponse.Fail("ERRCODE_UNKNOWN");
        }
    }

    UpdateColumnBy(columnToUpdate: string, value: string, getByColumnBy: string, getByValue: any) {
        throw new Error('Method not implemented.');
    }

    IsColumnValid = (columnname: string): boolean => {
        return this.columns.includes(columnname);
    }
}

export default MysqlTableProjectTokens;