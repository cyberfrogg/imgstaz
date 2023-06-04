import { Express, Request, Response } from "express";
import IRoute from "../../../../services/routes/IRoute";
import ReqResponse from '../../../../utils/ReqResponse';
import IStorageService from '../../../../services/storage/IStorageService';
import { getContentBufferFromUploadedFile, getImageExtension, getUploadFileFromRequest } from "../../../../utils/fileUtils";
import IDatabaseService from "../../../../services/database/IDatabaseService";
import { GetImageDimensions } from "../../../../utils/imageUtils";
import ImageUploadRouteResponse from '../../../../data/response/ImageUploadRouteResponse';
import { STATUS_ACCESS_DENIED, STATUS_INVALID_FIELDS, STATUS_NOT_FOUND, STATUS_UNKNOWN_ERROR } from "../../../../utils/statusCodes";
const pathutils = require('path');

class PostImageUploadRoute implements IRoute {
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
        const projectTokenReq = req.body.projecttoken;
        // validate projectToken field
        if (projectTokenReq == undefined || projectTokenReq == null || projectTokenReq == "") {
            res.status(STATUS_INVALID_FIELDS);
            res.json(ReqResponse.Fail("ERRCODE_INVALID_FIELDS"));
            return;
        }

        // get projecttoken by token
        const getProjectTokenResponse = await this.database.tableProjectTokens.GetByToken(projectTokenReq);
        if (!getProjectTokenResponse.success) {
            res.status(STATUS_ACCESS_DENIED);
            res.json(ReqResponse.Fail("ERRCODE_ACCESS_DENIED"));
            return;
        }

        // get project
        const getProjectResponse = await this.database.tableProjects.GetByUuid(getProjectTokenResponse.data.projectuuid);
        if (!getProjectResponse.success) {
            res.status(STATUS_NOT_FOUND);
            res.json(ReqResponse.Fail("ERRCODE_PROJECT_NOT_FOUND"));
            return;
        }

        // validate if file even uploaded
        const uploadedFile = getUploadFileFromRequest(req);

        if (uploadedFile == undefined || uploadedFile.data == undefined) {
            res.status(STATUS_INVALID_FIELDS);
            res.json(ReqResponse.Fail("ERRCODE_INVALID_FILE"));
            return;
        }

        const fileBinary = getContentBufferFromUploadedFile(uploadedFile)

        // validate is file an image
        const fileExtension = getImageExtension(fileBinary);
        if (fileExtension == undefined) {
            res.status(STATUS_INVALID_FIELDS);
            res.json(ReqResponse.Fail("ERRCODE_NOT_SUPPORTED_IMAGE_FORMAT"));
            return;
        }

        // get new row uuid
        const nextRowUUidResponse = await this.database.GetNextUuid();
        if (!nextRowUUidResponse.success) {
            res.status(STATUS_UNKNOWN_ERROR);
            res.json(ReqResponse.Fail("ERRCODE_UNKNOWN"));
            return;
        }

        // create empty row
        const emptyRowResponse = await this.database.tableImages.CreateEmpty(
            nextRowUUidResponse.data,
            getProjectResponse.data.uuid
        );
        if (!emptyRowResponse.success) {
            res.status(STATUS_UNKNOWN_ERROR);
            res.json(ReqResponse.Fail("ERRCODE_UNKNOWN"));
            return;
        }

        // get image dimensions
        const imageDimensions = GetImageDimensions(fileBinary);

        // upload file
        const savePath = this.getUploadKey(getProjectResponse.data.uuid, nextRowUUidResponse.data, fileExtension);
        const uploadResponse = await this.storage.bucket.upload(fileBinary, savePath);
        if (!uploadResponse.success) {
            res.status(STATUS_UNKNOWN_ERROR);
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
            res.status(STATUS_UNKNOWN_ERROR);
            res.json(ReqResponse.Fail("ERRCODE_UNKNOWN"));
            return;
        }

        // return success
        const successResponse = new ImageUploadRouteResponse(
            uploadResponse.data.bucket,
            uploadResponse.data.location,
            uploadResponse.data.key,
            nextRowUUidResponse.data,
            getProjectResponse.data.uuid,
            imageDimensions.width,
            imageDimensions.height,
            fileExtension
        );
        res.json(ReqResponse.Success(successResponse));
    }

    getUploadKey = (projectUuid: string, imageUuid: string, extension: string): string => {
        return pathutils.join(this.baseFolder, projectUuid, imageUuid + "." + extension);
    }
}

export default PostImageUploadRoute;