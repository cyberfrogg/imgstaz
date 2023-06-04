import IDatabaseTableActionBase from '../IDatabaseTableActionBase';
import ReqResponse from '../../../utils/ReqResponse';
import RowProjectToken from '../rows/RowProjectToken';

interface IDatabaseTableProjectTokens extends IDatabaseTableActionBase {
    Create(newRowUuid: string, projectUuid: string, token: string): Promise<ReqResponse<RowProjectToken>>;
    GetByUuid(uuid: string): Promise<ReqResponse<RowProjectToken>>;
    GetByName(name: string): Promise<ReqResponse<RowProjectToken>>;
    GetByToken(token: string): Promise<ReqResponse<RowProjectToken>>;
}

export default IDatabaseTableProjectTokens;