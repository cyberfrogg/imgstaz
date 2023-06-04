import IS3BucketService from "../../s3bucket/IS3BucketService";
import IStorageService from "../IStorageService";

class StorageService implements IStorageService {
    readonly bucket: IS3BucketService;

    constructor(bucket: IS3BucketService) {
        this.bucket = bucket
    }
}

export default StorageService;