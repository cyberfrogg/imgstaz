
class S3BucketUploadResponseData {
    bucket: string;
    location: string;
    key: string;

    constructor(bucket: string, location: string, key: string) {
        this.bucket = bucket;
        this.location = location;
        this.key = key;
    }
}

export default S3BucketUploadResponseData;