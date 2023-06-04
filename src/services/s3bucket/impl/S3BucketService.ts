import IBucketService from "../IS3BucketService";
import S3BucketConfig from "./S3BucketConfig";
import ReqResponse from '../../../utils/ReqResponse';
import S3BucketUploadResponseData from "./S3BucketUploadResponseData";
import ILoggerService from '../../logger/ILoggerService';
import AWS from "aws-sdk";

class S3BucketService implements IBucketService {
    private readonly config: S3BucketConfig;
    private readonly s3: AWS.S3;
    private readonly logger: ILoggerService;

    constructor(config: S3BucketConfig, logger: ILoggerService) {
        this.config = config;
        this.s3 = new AWS.S3(this.config);
        this.logger = logger;
    }

    upload = async (buffer: Buffer, key: string): Promise<ReqResponse<S3BucketUploadResponseData>> => {
        const params: AWS.S3.PutObjectRequest = {
            Bucket: this.config.s3bucketname,
            Key: key,
            Body: buffer
        };

        try {
            const stored = await this.s3.upload(params).promise();
            const dataReceived = new S3BucketUploadResponseData(stored.Bucket, stored.Location, stored.Key);

            return ReqResponse.Success(dataReceived);
        }
        catch (e) {
            this.logger.error(e);
            return ReqResponse.Fail("ERRCODE_UNKNOWN");
        }
    }
}

export default S3BucketService;