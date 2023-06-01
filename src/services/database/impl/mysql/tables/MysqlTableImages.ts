
import ReqResponse from '../../../../../utils/ReqResponse';
import RowImage from '../../../rows/RowImage';
import IDatabaseTableImages from '../../../tables/IDatabaseTableImages';

class MysqlTableImages implements IDatabaseTableImages {

    GetByUuid(uuid: string): Promise<ReqResponse<RowImage>> {
        throw new Error('Method not implemented.');
    }
    GetByName(name: string): Promise<ReqResponse<RowImage>> {
        throw new Error('Method not implemented.');
    }
    GetByToken(token: string): Promise<ReqResponse<RowImage>> {
        throw new Error('Method not implemented.');
    }
    GetBy(column: string, value: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}

export default MysqlTableImages;