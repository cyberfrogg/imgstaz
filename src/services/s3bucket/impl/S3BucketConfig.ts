class S3BucketConfig {
    readonly s3bucketname: string;
    readonly endpoint: string;
    readonly accessKeyId: string;
    readonly secretAccessKey: string;
    readonly sslEnabled: boolean;
    readonly s3ForcePathStyle: boolean;

    constructor(
        s3bucketname: string,
        endpoint: string,
        accessKeyId: string,
        secretAccessKey: string,
        sslEnabled: boolean,
        s3ForcePathStyle: boolean
    ) {
        this.s3bucketname = s3bucketname;
        this.endpoint = endpoint
        this.accessKeyId = accessKeyId
        this.secretAccessKey = secretAccessKey
        this.sslEnabled = sslEnabled
        this.s3ForcePathStyle = s3ForcePathStyle
    }

}

export default S3BucketConfig