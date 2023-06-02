import { Express } from 'express';

interface IRoute {
    path: string;
    initialize(expressApp: Express): Promise<void>;
}

export default IRoute;