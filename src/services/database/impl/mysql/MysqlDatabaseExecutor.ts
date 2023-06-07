import mysql, { ServerlessMysql, Transaction } from "serverless-mysql";
import MysqlConfig from "./MysqlConfig";
import ReqResponse from '../../../../utils/ReqResponse';
import ILoggerService from '../../../logger/ILoggerService';

class MysqlDatabaseExecutor {
    private readonly config: MysqlConfig;
    private readonly mysql: ServerlessMysql
    private readonly logger: ILoggerService;

    "constructor"(config: MysqlConfig, logger: ILoggerService) {
        this.config = config;
        this.logger = logger;
        this.mysql = mysql({
            config: this.config,
        });
    }

    async query(query: string, values: any): Promise<ReqResponse<any>> {
        try {
            const results = await this.mysql.query(query, values) as any[];

            return ReqResponse.Success(results);
        } catch (error) {
            this.logger.error("Unhandled database error occured");
            this.logger.error(JSON.stringify(error));
            return ReqResponse.Fail("ERRCODE_DATABASE_FAILED");
        }
    }

    transaction(): Transaction {
        return this.mysql.transaction();
    }
}

export default MysqlDatabaseExecutor;