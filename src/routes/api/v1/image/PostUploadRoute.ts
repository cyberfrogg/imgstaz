import { Express, Request, Response } from "express";
import IRoute from "../../../../services/routes/IRoute";
import ReqResponse from '../../../../utils/ReqResponse';
import IStorageService from '../../../../services/storage/IStorageService';
import { UploadedFile } from "express-fileupload";
import { allowedImageFormats, getContentBufferFromUploadedFile, getImageExtension, getUploadFileFromRequest } from "../../../../utils/fileUtils";
import IDatabaseService from "../../../../services/database/IDatabaseService";
import { GetImageDimensions } from "../../../../utils/imageUtils";
const pathutils = require('path');

class PostUploadRoute implements IRoute {
    readonly path: string;
    private readonly baseFolder: string = process.env.S3_BASE_FOLDER;

    private readonly storage: IStorageService;
    private readonly database: IDatabaseService;


    constructor(path: string, database: IDatabaseService, storage: IStorageService) {
        this.path = path;
        this.storage = storage;
        this.database = database;
    }

    async initialize(expressApp: Express): Promise<void> {
        expressApp.post(this.path, this.execute);
    }

    execute = async (req: Request, res: Response) => {
        // validate if file even uploaded
        const uploadedFile = getUploadFileFromRequest(req);

        if (uploadedFile == undefined || uploadedFile.data == undefined) {
            res.json(ReqResponse.Fail("ERRCODE_INVALID_FILE"));
            return;
        }

        const fileBinary = getContentBufferFromUploadedFile(uploadedFile)

        // validate is file an image
        const fileExtension = getImageExtension(fileBinary);
        if (fileExtension == undefined) {
            res.json(ReqResponse.Fail("Not allowed file type/extension found. Allowed image types: " + Object.keys(allowedImageFormats).toString()))
            return;
        }

        // todo: get project uuid by its token
        const projectUuid = "bedc8244-00c4-11ee-b3d7-f682a1ccfe54";

        // get new row uuid
        const nextRowUUidResponse = await this.database.GetNextUuid();
        if (!nextRowUUidResponse.success) {
            res.json(ReqResponse.Fail("ERRCODE_UNKNOWN"));
            return;
        }

        // create empty row
        const emptyRowResponse = await this.database.tableImages.CreateEmpty(
            nextRowUUidResponse.data,
            projectUuid
        );
        if (!emptyRowResponse.success) {
            res.json(ReqResponse.Fail("ERRCODE_UNKNOWN"));
            return;
        }

        // get image dimensions
        const imageDimensions = GetImageDimensions(fileBinary);

        // upload file
        const savePath = this.getUploadKey(projectUuid, nextRowUUidResponse.data, fileExtension);
        const uploadResponse = await this.storage.bucket.upload(fileBinary, savePath);
        if (!uploadResponse.success) {
            res.json(ReqResponse.Fail("ERRCODE_UNKNOWN"));
            return;
        }

        // update row
        const updateRowResponse = await this.database.tableImages.UpdateAfterUpload(
            nextRowUUidResponse.data,
            uploadResponse.data,
            imageDimensions.width,
            imageDimensions.height,
            fileExtension
        )
        if (!updateRowResponse.success) {
            res.json(ReqResponse.Fail("ERRCODE_UNKNOWN"));
            return;
        }


        res.json(ReqResponse.Success());
    }

    getUploadKey = (projectUuid: string, imageUuid: string, extension: string): string => {
        return pathutils.join(this.baseFolder, projectUuid, imageUuid + "." + extension);
    }
}

export default PostUploadRoute;