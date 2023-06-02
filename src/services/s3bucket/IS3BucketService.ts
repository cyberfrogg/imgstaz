import ReqResponse from "../../utils/ReqResponse";
import S3BucketUploadResponseData from "./impl/S3BucketUploadResponseData";

interface IS3BucketService {
    upload(buffer: Buffer, key: string): Promise<ReqResponse<S3BucketUploadResponseData>>
}

export default IS3BucketService;