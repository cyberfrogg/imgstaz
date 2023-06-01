import { Express, Request, Response } from "express";
import IRoute from "../../../../services/routes/IRoute";
import ReqResponse from '../../../../utils/ReqResponse';
import IStorageService from '../../../../services/storage/IStorageService';
import { UploadedFile } from "express-fileupload";

class PostUploadRoute implements IRoute {
    readonly path: string;
    private readonly storage: IStorageService;

    constructor(path: string, storage: IStorageService) {
        this.path = path;
        this.storage = storage;
    }

    async Initialize(expressApp: Express): Promise<void> {
        expressApp.post(this.path, this.Execute);
    }

    Execute = async (req: Request, res: Response) => {
        let uploadFile: UploadedFile = undefined;
        try {
            uploadFile = req.files.uploadfile as UploadedFile;
        } catch { }

        if (uploadFile == undefined || uploadFile.data == undefined) {
            res.json(ReqResponse.Fail("ERRCODE_INVALID_FILE_TYPE"));
        }


        const fileContent = uploadFile.data.toString("base64");
        const binary = Buffer.from(fileContent, "base64");

        this.storage.bucket.upload(binary, uploadFile.name);

        res.json(ReqResponse.Success(req.files.length));
    }
}

export default PostUploadRoute;