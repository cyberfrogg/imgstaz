import IDatabaseTableActionBase from '../IDatabaseTableActionBase';
import ReqResponse from '../../../utils/ReqResponse';
import RowProject from '../rows/RowProject';

interface IDatabaseTableProject extends IDatabaseTableActionBase {
    GetByUuid(uuid: string): Promise<ReqResponse<RowProject>>;
    GetByName(name: string): Promise<ReqResponse<RowProject>>;
}

export default IDatabaseTableProject;