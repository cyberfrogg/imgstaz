import { Express, Request, Response } from "express";
import IRoute from "../../../services/routes/IRoute";
import ReqResponse from '../../../utils/ReqResponse';

class GetPingRoute implements IRoute {
    readonly path: string;

    constructor(path) {
        this.path = path;
    }

    async Initialize(expressApp: Express): Promise<void> {
        expressApp.get(this.path, this.Execute);
    }

    async Execute(req: Request, res: Response) {
        res.json(ReqResponse.Success("pong"));
    }
}

export default GetPingRoute;