import ReqResponse from '../../../../../utils/ReqResponse';
import RowProject from '../../../rows/RowProject';
import IDatabaseTableProject from '../../../tables/IDatabaseTableProjects';
import MysqlDatabaseExecutor from '../MysqlDatabaseExecutor';
import ILoggerService from '../../../../logger/ILoggerService';

class MysqlTableProjects implements IDatabaseTableProject {
    private readonly executor: MysqlDatabaseExecutor;
    private readonly logger: ILoggerService;
    private readonly columns: string[] = ["uuid", "name"];

    constructor(executor: MysqlDatabaseExecutor, logger: ILoggerService) {
        this.executor = executor;
        this.logger = logger;
    }

    Create = async (newRowUuid: string, name: string): Promise<ReqResponse<RowProject>> => {
        try {
            const queryResponse = await this.executor.query(
                `INSERT INTO projects
                (uuid, name)
                VALUES (?, ?)`,
                [newRowUuid, name]
            );

            if (!queryResponse.success) {
                return ReqResponse.Fail("ERRCODE_UNKNOWN");
            }

            let responseData = new RowProject();
            responseData.name = name;
            responseData.uuid = newRowUuid;

            return ReqResponse.Success(responseData);
        }
        catch (e) {
            this.logger.error(e);
            return ReqResponse.Fail("ERRCODE_UNKNOWN");
        }
    }

    GetByUuid = async (uuid: string): Promise<ReqResponse<RowProject>> => {
        return await this.GetBy("uuid", uuid);
    }
    GetByName = async (name: string): Promise<ReqResponse<RowProject>> => {
        return await this.GetBy("name", name);
    }
    GetBy = async (column: string, value: string): Promise<ReqResponse<RowProject>> => {
        try {
            if (!this.IsColumnValid(column)) {
                console.log(column);
                return ReqResponse.Fail("ERRCODE_INVALID_COLUMN");
            }

            const queryResponse = await this.executor.query(
                `SELECT * FROM projects WHERE ` + column + ` = ?`,
                [value]
            );

            if (!queryResponse.success || queryResponse.data.length == 0) {
                return ReqResponse.Fail("ERRCODE_NOT_FOUND");
            }

            let responseData = new RowProject();
            responseData.uuid = queryResponse.data[0]["uuid"];
            responseData.name = queryResponse.data[0]["name"];

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

export default MysqlTableProjects;