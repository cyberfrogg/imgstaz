interface IDatabaseTableActionBase {
    GetBy(column: string, value: string): Promise<void>;
    UpdateColumnBy(columnToUpdate: string, value: string, getByColumnBy: string, getByValue);
}

export default IDatabaseTableActionBase;