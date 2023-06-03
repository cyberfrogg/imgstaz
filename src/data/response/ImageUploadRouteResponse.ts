
class ImageUploadRouteResponse {
    bucket: string;
    location: string;
    key: string;
    imageUuid: string;
    projectUuid: string;
    width: number;
    height: number;
    mime: string;

    constructor(
        bucket: string,
        location: string,
        key: string,
        imageuuid: string,
        projectuuid: string,
        width: number,
        height: number,
        mime: string
    ) {
        this.bucket = bucket
        this.location = location
        this.key = key
        this.imageUuid = imageuuid
        this.projectUuid = projectuuid
        this.width = width
        this.height = height
        this.mime = mime
    }
}

export default ImageUploadRouteResponse;