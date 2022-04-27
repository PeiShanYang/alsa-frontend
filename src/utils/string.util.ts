export class StringUtil {
    static formatAddSlash(origin: string): string {
        return `${origin.substring(0, 4)}/${origin.substring(4, 6)}/${origin.substring(6, 8)}`;
    }
}