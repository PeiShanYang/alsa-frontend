import Store from "./store.service";

export default class Api {
  static async getProjectList(): Promise<void> {
    Store.projectList = ["project01", "project02", "project03"];
  }
}
