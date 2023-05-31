import IDatabaseService from "../../IDatabaseService";
import IDatabaseTableProjects from "../../tables/IDatabaseTableProjects";
import IDatabaseTableProjectTokens from '../../tables/IDatabaseTableProjectTokens';
import IDatabaseTableImages from '../../tables/IDatabaseTableImages';


class MysqlDatabaseService implements IDatabaseService {
    readonly tableProjects: IDatabaseTableProjects;
    readonly tableProjectTokens: IDatabaseTableProjectTokens;
    readonly tableImages: IDatabaseTableImages;

    "constructor"(
        tableProjects: IDatabaseTableProjects,
        tableProjectTokens: IDatabaseTableProjectTokens,
        tableImages: IDatabaseTableImages,
    ) {
        this.tableProjects = tableProjects;
        this.tableProjectTokens = tableProjectTokens;
        this.tableImages = tableImages;
    }
}

export default MysqlDatabaseService;