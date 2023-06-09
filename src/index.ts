require('dotenv').config({ path: '.env' });
import express from 'express';
import IDatabaseService from './services/database/IDatabaseService';
import MysqlDatabaseService from './services/database/impl/mysql/MysqlDatabaseService';
import MysqlDatabaseExecutor from './services/database/impl/mysql/MysqlDatabaseExecutor';
import MysqlConfig from './services/database/impl/mysql/MysqlConfig';
import LoggerService from './services/logger/impl/LoggerService';
import ILoggerService from './services/logger/ILoggerService';
import ReqResponse from './utils/ReqResponse';
import MysqlTableImages from './services/database/impl/mysql/tables/MysqlTableImages';
import MysqlTableProjectTokens from './services/database/impl/mysql/tables/MysqlTableProjectTokens';
import MysqlTableProjects from './services/database/impl/mysql/tables/MysqlTableProjects';
import IRoute from './services/routes/IRoute';
import GetPingRoute from './routes/api/v1/GetPingRoute';
import S3BucketConfig from './services/s3bucket/impl/S3BucketConfig';
import IStorageService from './services/storage/IStorageService';
import S3BucketService from './services/s3bucket/impl/S3BucketService';
import StorageService from './services/storage/impl/StorageService';
import PostUploadRoute from './routes/api/v1/image/PostImageUploadRoute';
import PostProjectTokenCreate from './routes/api/v1/project/PostProjectTokenCreate';
import PostProjectCreate from './routes/api/v1/project/PostProjectCreate';
const fileUpload = require('express-fileupload');
const cors = require('cors');

const maxFileSize = Number(process.env.MAX_FILE_SIZE);
const logger = new LoggerService();


// express initializing
const app = express();
app.use(fileUpload({
    abortOnLimit: true,
    limits: { fileSize: maxFileSize * 1024 * 1024 },
}));
app.use(express.json());
app.use(cors({
    origin: process.env.WEBSITE_CORS_URL
}));



const initializeApp = async () => {
    const database = createDatabase(logger);
    const storage = createStorageService(logger);
    const routes = createRoutes(logger, database, storage);

    // handle all other errors
    app.use((err, req, res, next) => {
        if (err instanceof SyntaxError && 'body' in err) {
            logger.error("Unhandled error catched");
            logger.error(err);
            return res.json(ReqResponse.Fail("ERRCODE_UNKNOWN"));
        }
        next();
    });

    // start express listening
    const appPort = process.env.PORT
    app.listen(appPort, () => {
        return logger.log(`Backend is listening at port ${appPort}`);
    });
}

// create routes
const createRoutes = async (logger: ILoggerService, database: IDatabaseService, storage: IStorageService): Promise<Array<IRoute>> => {
    let routes = new Array<IRoute>();
    routes.push(new GetPingRoute("/api/v1/ping"));
    routes.push(new PostUploadRoute("/api/v1/image/upload", database, storage, logger));
    routes.push(new PostProjectTokenCreate("/api/v1/project/tokenCreate", database, logger));
    routes.push(new PostProjectCreate("/api/v1/project/create", database, logger));

    // initialize routes
    for (const route of routes) {
        await route.initialize(app);
        logger.log(`\x1b[32mInitialized ${route.path} route \x1b[0m`);
    }

    logger.log(`\x1b[32mAll routes are initialized! \x1b[0m`);
    return routes;
}

// create database service
const createDatabase = (logger: ILoggerService): IDatabaseService => {
    const config = new MysqlConfig(
        process.env.DB_ADDRESS,
        Number(process.env.DB_PORT),
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        process.env.DB_IS_DEBUG == "true",
        process.env.DB_IS_TRACE == "true",
    );
    const executor = new MysqlDatabaseExecutor(config, logger);

    const projectsTable = new MysqlTableProjects(executor, logger);
    const projectTokensTable = new MysqlTableProjectTokens(executor, logger);
    const imagesTable = new MysqlTableImages(logger, executor);

    logger.log(`\x1b[32mDatabase initialized! \x1b[0m`);
    return new MysqlDatabaseService(
        projectsTable,
        projectTokensTable,
        imagesTable,
        executor,
        logger
    );
}

// create storage service
const createStorageService = (logger: ILoggerService): IStorageService => {
    const config = new S3BucketConfig(
        process.env.S3_BUCKET_NAME,
        process.env.S3_BUCKET_ENDPOINT,
        process.env.S3_ACCESS_KEY_ID,
        process.env.S3_SECRET_KEY,
        process.env.S3_SSL_ENABLED == "1",
        process.env.S3_FORCE_PATH_STYLE == "1"
    )

    const s3Bucket = new S3BucketService(config, logger);

    logger.log(`\x1b[32mStorage Service initialized! \x1b[0m`);
    return new StorageService(s3Bucket);
}

logger.log("\n \x1b[34m --- APP START --- \x1b[0m")
initializeApp();