import IDatabaseTableProjects from "./tables/IDatabaseTableProjects";
import IDatabaseTableProjectTokens from './tables/IDatabaseTableProjectTokens';
import IDatabaseTableImages from './tables/IDatabaseTableImages';

interface IDatabaseService {
    tableProjects: IDatabaseTableProjects;
    tableProjectTokens: IDatabaseTableProjectTokens;
    tableImages: IDatabaseTableImages;
}

export default IDatabaseService;