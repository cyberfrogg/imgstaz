import IBucketService from "../IS3BucketService";
import S3BucketConfig from "./S3BucketConfig";
import AWS from "aws-sdk";

class S3BucketService implements IBucketService {
    private readonly config: S3BucketConfig;
    private readonly s3: AWS.S3;

    constructor(config: S3BucketConfig) {
        this.config = config;
        this.s3 = new AWS.S3(this.config);
    }

    upload(buffer: Buffer, key: string) {
        const params: AWS.S3.PutObjectRequest = {
            Bucket: this.config.s3bucketname,
            Key: key,
            Body: buffer
        };

        this.s3.upload(params, function (err, data) {
            if (err) {
                throw err;
            }

            console.log(data);
        });
    }
}

export default S3BucketService;