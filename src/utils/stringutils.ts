import crypto from "crypto";

const generateRandomString = (length: number) => {
    return crypto.randomBytes(length).toString("hex");
}

const hashString = (value: string) => {
    return crypto.createHash('sha256').update(value).digest('hex').toString();
}

const hashStringWithSalt = (value: string, salt: string) => {
    return hashString(salt + value);
}

const textToSlug = (value: string): string => {
    return value.toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
}

export { generateRandomString, hashString, hashStringWithSalt, textToSlug }