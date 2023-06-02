import IDatabaseTableProjects from "./tables/IDatabaseTableProjects";
import IDatabaseTableProjectTokens from './tables/IDatabaseTableProjectTokens';
import IDatabaseTableImages from './tables/IDatabaseTableImages';
import ReqResponse from '../../utils/ReqResponse';

interface IDatabaseService {
    tableProjects: IDatabaseTableProjects;
    tableProjectTokens: IDatabaseTableProjectTokens;
    tableImages: IDatabaseTableImages;
    GetNextUuid(): Promise<ReqResponse<string>>
}

export default IDatabaseService;