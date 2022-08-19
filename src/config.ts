import Vue from "vue";
const config = Vue.observable({
    apiUrl: ''
})
export default config;
export class Config {
    static async init(): Promise<void> {
        const jsonRes = await fetch('config.json');
        const json = await jsonRes.json();
        config.apiUrl = json.API_URL;
    }
}
Config.init();