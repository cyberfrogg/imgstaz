class MysqlConfig {
    readonly host: string;
    readonly port: number;
    readonly database: string;
    readonly user: string;
    readonly password: string;
    readonly debug: boolean;
    readonly trace: boolean;

    constructor(host: string, port: number, database: string, user: string, password: string, debug: boolean, trace: boolean) {
        this.host = host;
        this.port = port;
        this.database = database;
        this.user = user;
        this.password = password;
        this.debug = debug;
        this.trace = trace;
    }
}

export default MysqlConfig;