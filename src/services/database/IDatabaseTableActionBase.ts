interface IDatabaseTableActionBase {
    GetBy(column: string, value: string): Promise<void>;
}

export default IDatabaseTableActionBase;