import IDatabaseTableActionBase from '../IDatabaseTableActionBase';
import ReqResponse from '../../../utils/ReqResponse';
import RowProject from '../rows/RowProject';

interface IDatabaseTableProject extends IDatabaseTableActionBase {
    Create(newRowUuid: string, name: string): Promise<ReqResponse<RowProject>>;
    GetByUuid(uuid: string): Promise<ReqResponse<RowProject>>;
    GetByName(name: string): Promise<ReqResponse<RowProject>>;
}

export default IDatabaseTableProject;