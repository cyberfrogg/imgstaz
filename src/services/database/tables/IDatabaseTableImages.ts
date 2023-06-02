import IDatabaseTableActionBase from '../IDatabaseTableActionBase';
import ReqResponse from '../../../utils/ReqResponse';
import RowImage from '../rows/RowImage';
import S3BucketUploadResponseData from '../../s3bucket/impl/S3BucketUploadResponseData';

interface IDatabaseTableImages extends IDatabaseTableActionBase {
    CreateEmpty(newRowUuid: string, projectUuid: string): Promise<ReqResponse<RowImage>>;
    GetByUuid(uuid: string): Promise<ReqResponse<RowImage>>;
    GetByName(name: string): Promise<ReqResponse<RowImage>>;
    GetByToken(token: string): Promise<ReqResponse<RowImage>>;
    UpdateAfterUpload(rowUuid: string, pointerData: S3BucketUploadResponseData, width: number, height: number, mime: string): Promise<ReqResponse<undefined>>;
}

export default IDatabaseTableImages;