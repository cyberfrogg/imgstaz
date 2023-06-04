import IDatabaseService from "../../IDatabaseService";
import IDatabaseTableProjects from "../../tables/IDatabaseTableProjects";
import IDatabaseTableProjectTokens from '../../tables/IDatabaseTableProjectTokens';
import IDatabaseTableImages from '../../tables/IDatabaseTableImages';
import ReqResponse from "../../../../utils/ReqResponse";
import MysqlDatabaseExecutor from './MysqlDatabaseExecutor';
import ILoggerService from '../../../logger/ILoggerService';


class MysqlDatabaseService implements IDatabaseService {
    readonly tableProjects: IDatabaseTableProjects;
    readonly tableProjectTokens: IDatabaseTableProjectTokens;
    readonly tableImages: IDatabaseTableImages;

    private readonly executor: MysqlDatabaseExecutor;
    private readonly logger: ILoggerService;

    "constructor"(
        tableProjects: IDatabaseTableProjects,
        tableProjectTokens: IDatabaseTableProjectTokens,
        tableImages: IDatabaseTableImages,
        executor: MysqlDatabaseExecutor,
        logger: ILoggerService
    ) {
        this.tableProjects = tableProjects;
        this.tableProjectTokens = tableProjectTokens;
        this.tableImages = tableImages;
        this.executor = executor;
        this.logger = logger;
    }

    GetNextUuid = async (): Promise<ReqResponse<string>> => {
        const queryResponse = await this.executor.query(
            `SELECT UUID() AS UUID_Value`,
            []
        )

        if (!queryResponse.success)
            return ReqResponse.Fail(queryResponse.message);

        try {
            const uuid = queryResponse.data[0]["UUID_Value"];
            return ReqResponse.Success(uuid);
        }
        catch (e) {
            this.logger.error(e);
            return ReqResponse.Fail(queryResponse.message);
        }
    }
}

export default MysqlDatabaseService;