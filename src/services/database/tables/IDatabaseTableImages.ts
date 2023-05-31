import IDatabaseTableActionBase from '../IDatabaseTableActionBase';
import ReqResponse from '../../../utils/ReqResponse';
import RowImage from '../rows/RowImage';

interface IDatabaseTableImages extends IDatabaseTableActionBase {
    GetByUuid(uuid: string): Promise<ReqResponse<RowImage>>;
    GetByName(name: string): Promise<ReqResponse<RowImage>>;
    GetByToken(token: string): Promise<ReqResponse<RowImage>>;
}

export default IDatabaseTableImages;