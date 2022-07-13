import storeService from "@/services/store.service"

export default class Logger {
    static log(...messages: unknown[]): void {
        if (storeService.debugMode) console.log(...messages)
    }
}