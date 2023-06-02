
import ReqResponse from '../../../../../utils/ReqResponse';
import RowImage from '../../../rows/RowImage';
import IDatabaseTableImages from '../../../tables/IDatabaseTableImages';
import ILoggerService from '../../../../logger/ILoggerService';
import MysqlDatabaseExecutor from '../MysqlDatabaseExecutor';
import S3BucketUploadResponseData from '../../../../s3bucket/impl/S3BucketUploadResponseData';

class MysqlTableImages implements IDatabaseTableImages {
    private readonly logger: ILoggerService;
    private readonly executor: MysqlDatabaseExecutor;

    constructor(logger: ILoggerService, executor: MysqlDatabaseExecutor) {
        this.logger = logger;
        this.executor = executor;
    }

    CreateEmpty = async (newRowUuid: string, projectUuid: string): Promise<ReqResponse<RowImage>> => {
        try {
            const queryResponse = await this.executor.query(
                `INSERT INTO images
                (uuid, projectuuid, pointerdata, width, height, mime)
                VALUES (?, ?, "{}", 0, 0, "")`,
                [newRowUuid, projectUuid]
            );

            if (!queryResponse.success) {
                return ReqResponse.Fail("ERRCODE_UNKNOWN");
            }

            return ReqResponse.Success(new RowImage());
        }
        catch (e) {
            this.logger.error(e);
            return ReqResponse.Fail("ERRCODE_UNKNOWN");
        }
    }

    GetByUuid = async (uuid: string): Promise<ReqResponse<RowImage>> => {
        throw new Error('Method not implemented.');
    }
    GetByName = async (name: string): Promise<ReqResponse<RowImage>> => {
        throw new Error('Method not implemented.');
    }
    GetByToken = async (token: string): Promise<ReqResponse<RowImage>> => {
        throw new Error('Method not implemented.');
    }
    GetBy = async (column: string, value: string): Promise<void> => {
        throw new Error('Method not implemented.');
    }

    UpdateColumnBy(columnToUpdate: string, value: string, getByColumnBy: string, getByValue: any) {
        throw new Error('Method not implemented.');
    }

    UpdateAfterUpload = async (
        rowUuid: string,
        pointerData: S3BucketUploadResponseData,
        width: number,
        height: number,
        mime: string
    ): Promise<ReqResponse<undefined>> => {
        try {
            const pointerDataJson: string = JSON.stringify(pointerData);

            const queryResponse = await this.executor.query(
                `UPDATE images
                SET pointerdata = ?, width = ?, height = ?, mime = ?
                WHERE uuid = ?;`,
                [pointerDataJson, width, height, mime, rowUuid]
            );

            if (!queryResponse.success || queryResponse.data["affectedRows"] != 1) {
                return ReqResponse.Fail("ERRCODE_UNKNOWN");
            }

            return ReqResponse.Success();
        }
        catch (e) {
            this.logger.error(e);
            return ReqResponse.Fail("ERRCODE_UNKNOWN");
        }
    }
}

export default MysqlTableImages;