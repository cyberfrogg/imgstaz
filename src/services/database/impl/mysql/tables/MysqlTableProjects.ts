import ReqResponse from '../../../../../utils/ReqResponse';
import ProjectRow from '../../../rows/RowProject';
import IDatabaseTableProject from '../../../tables/IDatabaseTableProjects';
import MysqlDatabaseExecutor from '../MysqlDatabaseExecutor';

class MysqlTableProjects implements IDatabaseTableProject {
    private readonly mysql: MysqlDatabaseExecutor;

    constructor(mysql: MysqlDatabaseExecutor) {
        this.mysql = mysql
    }

    GetByUuid(uuid: string): Promise<ReqResponse<ProjectRow>> {
        throw new Error('Method not implemented.');
    }
    GetByName(name: string): Promise<ReqResponse<ProjectRow>> {
        throw new Error('Method not implemented.');
    }
    GetBy(column: string, value: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    UpdateColumnBy(columnToUpdate: string, value: string, getByColumnBy: string, getByValue: any) {
        throw new Error('Method not implemented.');
    }
}

export default MysqlTableProjects;