import IS3BucketService from "../s3bucket/IS3BucketService";

interface IStorageService {
    bucket: IS3BucketService
}

export default IStorageService