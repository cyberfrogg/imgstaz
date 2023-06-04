import ReqResponse from "../../utils/ReqResponse";

interface IDatabaseTableActionBase {
    GetBy(column: string, value: string): Promise<ReqResponse<any>>;
    UpdateColumnBy(columnToUpdate: string, value: string, getByColumnBy: string, getByValue);
}

export default IDatabaseTableActionBase;