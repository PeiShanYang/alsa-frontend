import jwt from 'jsonwebtoken';

export class StringUtil {
    static formatAddSlash(origin: string): string {
        return `${origin.substring(0, 4)}/${origin.substring(4, 6)}/${origin.substring(6, 8)}`;
    }

    static encodeObject(obj: any): string {
        const info: string = jwt.sign(obj, 'auo');
        return info;
    }
}