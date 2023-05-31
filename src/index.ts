require('dotenv').config({ path: '.env' });
import express from 'express';
import IDatabaseService from './services/database/IDatabaseService';
import MysqlDatabaseService from './services/database/impl/mysql/MysqlDatabaseService';
import MysqlDatabaseExecutor from './services/database/impl/mysql/MysqlDatabaseExecutor';
import MysqlConfig from './services/database/impl/mysql/MysqlConfig';
import LoggerService from './services/logger/impl/LoggerService';
import ILoggerService from './services/logger/ILoggerService';
import ReqResponse from './utils/ReqResponse';
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.WEBSITE_CORS_URL
}));

const initializeApp = async () => {
    const logger = new LoggerService();
    const database = initializeDatabase(logger);

    // handle all other errors
    app.use((err, req, res, next) => {
        if (err instanceof SyntaxError && 'body' in err) {
            console.error(err);
            return res.json(ReqResponse.Fail("ERRCODE_UNKNOWN"));
        }
        next();
    });

    // start express listening
    const appPort = process.env.PORT
    app.listen(appPort, () => {
        return console.log(`Backend is listening at port ${appPort}`);
    });
}

const initializeDatabase = (logger: ILoggerService): IDatabaseService => {
    const config = new MysqlConfig(
        process.env.DB_ADDRESS,
        Number(process.env.DB_PORT),
        process.env.DB_NAME,
        process.env.DB_PASS,
        process.env.DB_PASS,
    );
    const executor = new MysqlDatabaseExecutor(config, logger);

    return new MysqlDatabaseService(null, null, null);
}

console.log("\n \x1b[34m --- APP START --- \x1b[0m")
initializeApp();