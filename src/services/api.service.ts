import Store from "./store.service";

export default class Api {
  static async getProjectList(): Promise<void> {
    Store.projectList = [
      {
        name: "Default Project",
      },
      {
        name: "Project01",
      },
      {
        name: "project03",
      },
    ];
  }
  static async createProject(): Promise<void>{
    Store.projectList = [...Store.projectList,]
  }
}
