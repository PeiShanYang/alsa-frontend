import jwt from 'jsonwebtoken';

export class StringUtil {
    static formatAddSlash(origin: string): string {
        return `${origin.substring(0, 4)}/${origin.substring(4, 6)}/${origin.substring(6, 8)}`;
    }

    static encodeObject(obj: any): string {
        const info: string = jwt.sign(obj, 'auo');
        return info;
    }

    static getCookie(cname: string): string {
        const name = cname + '=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return ''
    }
}
