import ReqResponse from '../../../../../utils/ReqResponse';
import RowProjectToken from '../../../rows/RowProjectToken';
import IDatabaseTableProjectTokens from '../../../tables/IDatabaseTableProjectTokens';

class MysqlTableProjectTokens implements IDatabaseTableProjectTokens {
    GetByUuid(uuid: string): Promise<ReqResponse<RowProjectToken>> {
        throw new Error('Method not implemented.');
    }
    GetByName(name: string): Promise<ReqResponse<RowProjectToken>> {
        throw new Error('Method not implemented.');
    }
    GetByToken(token: string): Promise<ReqResponse<RowProjectToken>> {
        throw new Error('Method not implemented.');
    }
    GetBy(column: string, value: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    UpdateColumnBy(columnToUpdate: string, value: string, getByColumnBy: string, getByValue: any) {
        throw new Error('Method not implemented.');
    }
}

export default MysqlTableProjectTokens;