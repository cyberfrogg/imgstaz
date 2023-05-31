import IDatabaseTableActionBase from '../IDatabaseTableActionBase';
import ReqResponse from '../../../utils/ReqResponse';
import ProjectRow from '../rows/RowProject';

interface IDatabaseTableProject extends IDatabaseTableActionBase {
    GetByUuid(uuid: string): Promise<ReqResponse<ProjectRow>>;
    GetByName(name: string): Promise<ReqResponse<ProjectRow>>;
}

export default IDatabaseTableProject;