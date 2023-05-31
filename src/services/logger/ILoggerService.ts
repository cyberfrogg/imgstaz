interface ILoggerService {
    log(message: any): void;
    warn(message: any): void;
    error(message: any): void;
}

export default ILoggerService;