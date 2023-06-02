import ILoggerService from "../ILoggerService";

class LoggerService implements ILoggerService {
    log(message: any): void {
        let displayString = this.getHumanReadableStringFromObject(message);
        displayString = "\x1b[37m " + this.getCurrentTimeFormatted() + " " + displayString;
        console.log(displayString);
    }
    warn(message: any): void {
        let displayString = this.getHumanReadableStringFromObject(message);
        displayString = "\x1b[33m " + this.getCurrentTimeFormatted() + " " + displayString;
        console.warn(displayString);
    }
    error(message: any): void {
        let displayString = this.getHumanReadableStringFromObject(message);
        displayString = "\x1b[31m " + this.getCurrentTimeFormatted() + " " + displayString;
        console.error(displayString);
    }

    getHumanReadableStringFromObject(message: any): string {
        if (message === undefined) {
            return "undefined";
        }

        if (message === null) {
            return "null"
        }

        if (typeof message === 'object' || Array.isArray(message)) {
            return JSON.stringify(message);
        }

        return message.toString();
    }

    getCurrentTimeFormatted(): string {
        let now = new Date();
        return now.toLocaleString("en-GB", { hour12: false }).replace(',', '');
    }
}

export default LoggerService;