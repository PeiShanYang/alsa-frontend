import { CreateProjectByKeyReq } from "@/io/rest/createProject";
import { GetProjectRes } from "@/io/rest/getProject";
import { GetExperimentsReq, GetExperimentsRes } from "@/io/rest/getExperiments";
import { CheckDatasetReq, CheckDatasetRes } from "@/io/rest/checkDataset";
import axios, { AxiosResponse } from "axios";
import store from "@/services/store.service";
import { Project } from "@/io/project";

const host = 'http://tw100104318:37510/';

export default class Api {
  static async getProjects(): Promise<void> {
    const response = await axios.post(
      host + 'get-projects',
    );

    if (response.status !== 200) return;

    const res: GetProjectRes = response.data;
    if (res.code !== 0) {
      console.log(res.message);
      return;
    }

    if (res.data) {
      store.projectList = new Map<string, Project>(
        res.data.projects.map((v) => [v, new Project()])
      );
    }
  }

  static async createProjectByKey(name: string, key: string): Promise<void> {
    const reqData: CreateProjectByKeyReq = { name, key,
      //"key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDb25maWciOnsiUHJpdmF0ZVNldHRpbmciOnsiZGF0YXNldFBhdGgiOiIifX0sIkNvbmZpZ0F1Z21lbnRhdGlvbiI6eyJBdWdtZW50YXRpb25QYXJhIjp7InJhbmRvbUhvcml6b250YWxGbGlwIjp7InN3aXRjaCI6MSwicHJvYmFiaWxpdHkiOjAuNX19fSwiQ29uZmlnRXZhbHVhdGlvbiI6eyJFdmFsdWF0aW9uUGFyYSI6eyJzaG93QWNjIjoxLCJzaG93Q2xhc3NBY2MiOjEsInNob3dSYXRlIjp7InN3aXRjaCI6MSwidGFyZ2V0SW5kZXgiOiJPSyJ9LCJzaG93V3JvbmdGaWxlIjowfX0sIkNvbmZpZ01vZGVsU2VydmljZSI6eyJMb3NzRnVuY3Rpb25QYXJhIjp7Imxvc3NGdW5jdGlvbiI6IkNyb3NzRW50cm9weUxvc3MifSwiTGVhcm5pbmdSYXRlIjp7ImxlYXJuaW5nUmF0ZSI6MC4wMX0sIk9wdGltaXplclBhcmEiOnsiQWRhbSI6eyJzd2l0Y2giOjEsImJldGFzIjpbMC45LDAuOTk5XSwiZXBzIjoxZS04LCJ3ZWlnaHREZWNheSI6MC4wMDA1LCJhbXNncmFkIjowfX0sIlNjaGVkdWxlclBhcmEiOnsic3RlcExSIjp7InN3aXRjaCI6MSwic3RlcF9zaXplIjoxLCJnYW1tYSI6MC41fX19LCJDb25maWdQb3N0cHJvY2VzcyI6eyJQb3N0UHJvY2Vzc1BhcmEiOnsiY29uZmlkZW5jZUZpbHRlciI6eyJzd2l0Y2giOjEsInRocmVzaG9sZCI6MC43NSwic2VsZWN0TGFiZWwiOiJPSyIsImNsYXNzTGlzdCI6WyJORyIsIk9LIl19fX0sIkNvbmZpZ1ByZXByb2Nlc3MiOnsiUHJlcHJvY2Vzc1BhcmEiOnsiaW1hZ2VTaXplIjpbMjI0LDIyNF0sIm5vcm1hbGl6ZSI6eyJzd2l0Y2giOjEsIm1vZGUiOjQsIm1lYW4iOlswLjQ5MDAyOTI5LDAuNDkwMDI5MjksMC40OTAwMjkyOV0sInN0ZCI6WzAuMjYxODQ2MTMsMC4yNjE4NDYxMywwLjI2MTg0NjEzXX19fSwiQ29uZmlnUHl0b3JjaE1vZGVsIjp7IlNlbGVjdGVkTW9kZWwiOnsibW9kZWwiOnsic3RydWN0dXJlIjoicmVnbmV0X3lfNDAwbWYiLCJwcmV0cmFpbmVkIjoxfX0sIkNsc01vZGVsUGFyYSI6eyJjdWRhRGV2aWNlIjowLCJiYXRjaFNpemUiOjgsImVwb2NocyI6Mn19LCJDb25maWdSZXN1bHRTdG9yYWdlIjp7IlJlc3VsdFN0b3JhZ2UiOnsic2F2ZUFjY1R4dCI6MSwiZHJhd0FjY0N1cnZlIjoxLCJkcmF3Q29uZnVzaW9uTWF0cml4IjoxfX19.pOVdDcU6L9s6xFwOhWb3Aro3BIQiS4xSZC6RXSEKp64",
    };
    const response: AxiosResponse<GetProjectRes> = await axios.post(
      host + 'create-project-by-key',
      reqData,
    );

    if (response.status !== 200) return;

    const res: GetProjectRes = response.data;
    if (res.code !== 0) {
      console.log(res.message);
      return;
    }

    if (res.data) {
      store.projectList = new Map<string, Project>(
        res.data.projects.map((v) => [v, new Project()])
      );
    }
  }

  static async getExperiments(): Promise<void> {
    if (!store.currentProject) {
      console.error('no project selected');
      return;
    }

    const reqData: GetExperimentsReq = {
      "projectName": store.currentProject,
    };
    const response: AxiosResponse<GetExperimentsRes> = await axios.post(
      host + 'get-experiments',
      reqData,
    );

    if (response.status !== 200) return;

    const res: GetExperimentsRes = response.data;
    if (res.code !== 0) {
      console.log(res.message);
      return;
    }

    if (!res.data) return;

    console.log("res data", res.data);
    const project = store.projectList.get(store.currentProject);
    if (!project) return;

    project.experiments = res.data;
    console.log(store.projectList);
  }

  static async checkDataset(datasetPath: string): Promise<void> {
    if (!store.currentProject) return;

    const reqData: CheckDatasetReq = {
      projectName: store.currentProject,
      datasetPath,
    }
    const response: AxiosResponse<CheckDatasetRes> = await axios.post(
      host + 'check-dataset',
      reqData,
    )

    if (response.status !== 200) return;

    const res: CheckDatasetRes = response.data;
    if (res.code !==0) console.log(res.message);

    if(res.data) console.log("res.data",res.data);
  }
}
