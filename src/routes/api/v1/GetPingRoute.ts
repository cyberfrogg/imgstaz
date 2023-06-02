import { Express, Request, Response } from "express";
import IRoute from "../../../services/routes/IRoute";
import ReqResponse from '../../../utils/ReqResponse';

class GetPingRoute implements IRoute {
    readonly path: string;

    constructor(path) {
        this.path = path;
    }

    async initialize(expressApp: Express): Promise<void> {
        expressApp.get(this.path, this.execute);
    }

    async execute(req: Request, res: Response) {
        res.json(ReqResponse.Success("pong"));
    }
}

export default GetPingRoute;