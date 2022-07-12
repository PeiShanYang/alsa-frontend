export default class Logger {
    static debugMode = false

    static log(...messages: Object[]) {
        if (Logger.debugMode) console.log(...messages)
    }
}