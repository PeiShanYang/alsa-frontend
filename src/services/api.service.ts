import { CreateProjectByKeyReq } from "@/io/rest/createProject";
import { GetProjectRes } from "@/io/rest/getProject";
import { GetExperimentsReq, GetExperimentsRes } from "@/io/rest/getExperiments";
import { CheckDatasetReq, CheckDatasetRes } from "@/io/rest/checkDataset";
import axios, { AxiosResponse } from "axios";
import store from "@/services/store.service";
import { Project } from "@/io/project";
import { Experiment } from "@/io/experiment";
import { GetDatasetsReq, GetDatasetsRes } from "@/io/rest/getDatasets";
import { DatasetStatus } from "@/io/dataset";

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
    const reqData: CreateProjectByKeyReq = {
      name,
      "key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDb25maWciOnsiUHJpdmF0ZVNldHRpbmciOnsiZGF0YXNldFBhdGgiOiIifX0sIkNvbmZpZ0F1Z21lbnRhdGlvbiI6eyJBdWdtZW50YXRpb25QYXJhIjp7InJhbmRvbUhvcml6b250YWxGbGlwIjp7InN3aXRjaCI6MSwicHJvYmFiaWxpdHkiOjAuNX19fSwiQ29uZmlnRXZhbHVhdGlvbiI6eyJFdmFsdWF0aW9uUGFyYSI6eyJzaG93QWNjIjoxLCJzaG93Q2xhc3NBY2MiOjF9fSwiQ29uZmlnTW9kZWxTZXJ2aWNlIjp7Ikxvc3NGdW5jdGlvblBhcmEiOnsibG9zc0Z1bmN0aW9uIjoiQ3Jvc3NFbnRyb3B5TG9zcyJ9LCJMZWFybmluZ1JhdGUiOnsibGVhcm5pbmdSYXRlIjowLjAwMX0sIk9wdGltaXplclBhcmEiOnsiQWRhbSI6eyJzd2l0Y2giOjEsImJldGFzIjpbMC45LDAuOTk5XSwiZXBzIjoxZS04LCJ3ZWlnaHREZWNheSI6MC4wMDA1LCJhbXNncmFkIjowfX0sIlNjaGVkdWxlclBhcmEiOnsic3RlcExSIjp7InN3aXRjaCI6MSwic3RlcFNpemUiOjEsImdhbW1hIjowLjV9fX0sIkNvbmZpZ1Bvc3Rwcm9jZXNzIjp7IlBvc3RQcm9jZXNzUGFyYSI6eyJjb25maWRlbmNlRmlsdGVyIjp7InN3aXRjaCI6MSwidGhyZXNob2xkIjowLjc1LCJzZWxlY3RMYWJlbCI6Ik9LIiwiY2xhc3NMaXN0IjpbIk5HIiwiT0siXX19fSwiQ29uZmlnUHJlcHJvY2VzcyI6eyJQcmVwcm9jZXNzUGFyYSI6eyJub3JtYWxpemUiOnsibW9kZSI6MH19fSwiQ29uZmlnUHl0b3JjaE1vZGVsIjp7IlNlbGVjdGVkTW9kZWwiOnsibW9kZWwiOnsic3RydWN0dXJlIjoiYXVvX21tZmFfbW9kZWwiLCJwcmV0cmFpbmVkIjoxfX0sIkNsc01vZGVsUGFyYSI6eyJiYXRjaFNpemUiOjE2LCJlcG9jaHMiOjJ9fX0.IYGFV0GmXV844ePMJw-jl_jJtNJjrWsQe0v0oDQB3ro",
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

    const project = store.projectList.get(store.currentProject);
    if (project === undefined) return;

    project.experiments = new Map<string, Experiment>(Object.entries(res.data));
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
    );

    if (response.status !== 200) return;

    const res: CheckDatasetRes = response.data;
    if (res.code !== 0) console.log(res.message);

    if (res.data) {
      console.log("res.data", res.data);
    }


  }


  static async getDatasets(projectName: string): Promise<GetDatasetsRes | undefined> {
    if (!store.currentProject) return;

    const reqData: GetDatasetsReq = {
      projectName,
    }
    const response: AxiosResponse<GetDatasetsRes> = await axios.post(
      host + 'get-datasets',
      reqData,
    )

    if (response.status !== 200) return;

    const res: GetDatasetsRes = response.data;
    return res
  }

  static async setExperimentDataset(projectName: string, experimentId: string, datasetPath: string): Promise<void> {
    if (!store.currentProject) return;
  }
}
