import axios, { AxiosResponse } from "axios";
import store from "@/services/store.service";
import { Project } from "@/io/project";
import { Experiment } from "@/io/experiment";
import { DatasetStatus } from "@/io/dataset";
import { GetProjectRes } from "@/io/rest/getProject";
import { CreateProjectByKeyReq } from "@/io/rest/createProject";
import { GetExperimentsReq, GetExperimentsRes } from "@/io/rest/getExperiments";
import { SetExprimentDatasetReq, SetExprimentDatasetRes } from "@/io/rest/setExperimentDataset";
import { GetDatasetsReq, GetDatasetsRes } from "@/io/rest/getDatasets";
import { CheckDatasetReq, CheckDatasetRes } from "@/io/rest/checkDataset";
import { RunExperimentTrainReq, RunExperimentTrainRes } from "@/io/rest/runExperimentTrain";
import { GetInformationTrainRes, GetInformationTrainResData } from "@/io/rest/getInformationTrain";
import { DeleteRunReq, DeleteRunRes } from "@/io/rest/deleteRun";


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

      store.projectList.forEach((project, name) => {
        project.name = name
      })

    }
  }
  static async createProjectByKey(name: string, key: string): Promise<void> {
    const reqData: CreateProjectByKeyReq = {
      name,
      "key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDb25maWciOnsiUHJpdmF0ZVNldHRpbmciOnsiZGF0YXNldFBhdGgiOiIifX0sIkNvbmZpZ0F1Z21lbnRhdGlvbiI6eyJBdWdtZW50YXRpb25QYXJhIjp7InJhbmRvbUhvcml6b250YWxGbGlwIjp7InN3aXRjaCI6MSwicHJvYmFiaWxpdHkiOjAuNX19fSwiQ29uZmlnRXZhbHVhdGlvbiI6eyJFdmFsdWF0aW9uUGFyYSI6eyJzaG93QWNjIjp7InN3aXRjaCI6MX0sInNob3dDbGFzc0FjYyI6eyJzd2l0Y2giOjF9fX0sIkNvbmZpZ01vZGVsU2VydmljZSI6eyJMb3NzRnVuY3Rpb25QYXJhIjp7Imxvc3NGdW5jdGlvbiI6IkNyb3NzRW50cm9weUxvc3MifSwiTGVhcm5pbmdSYXRlIjp7ImxlYXJuaW5nUmF0ZSI6MC4wMDF9LCJPcHRpbWl6ZXJQYXJhIjp7IkFkYW0iOnsic3dpdGNoIjoxLCJiZXRhcyI6WzAuOSwwLjk5OV0sImVwcyI6MWUtOCwid2VpZ2h0RGVjYXkiOjAuMDAwNSwiYW1zZ3JhZCI6MH19LCJTY2hlZHVsZXJQYXJhIjp7InN0ZXBMUiI6eyJzd2l0Y2giOjEsInN0ZXBTaXplIjoxLCJnYW1tYSI6MC41fX19LCJDb25maWdQb3N0cHJvY2VzcyI6eyJQb3N0UHJvY2Vzc1BhcmEiOnsiY29uZmlkZW5jZUZpbHRlciI6eyJzd2l0Y2giOjEsInRocmVzaG9sZCI6MC43NSwic2VsZWN0TGFiZWwiOiJPSyIsImNsYXNzTGlzdCI6WyJORyIsIk9LIl19fX0sIkNvbmZpZ1ByZXByb2Nlc3MiOnsiUHJlcHJvY2Vzc1BhcmEiOnsibm9ybWFsaXplIjp7InN3aXRjaCI6MSwibW9kZSI6MH19fSwiQ29uZmlnUHl0b3JjaE1vZGVsIjp7IlNlbGVjdGVkTW9kZWwiOnsibW9kZWwiOnsic3RydWN0dXJlIjoiYXVvX3VucmVzdHJpY3RlZF9wb3dlcmZ1bF9tb2RlbCIsInByZXRyYWluZWQiOjF9fSwiQ2xzTW9kZWxQYXJhIjp7ImJhdGNoU2l6ZSI6MTYsImVwb2NocyI6Mn19fQ.gMuiZ6nWPq3mkkn2_X4DNm7TyYIL_a6uK7Dk91jcCS0",
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

  static async getExperiments(projectName: string): Promise<void> {

    const reqData: GetExperimentsReq = {
      projectName,
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

    const project = store.projectList.get(projectName);
    if (project === undefined) return;

    if (!res.data) return;
    project.experiments = new Map<string, Experiment>(Object.entries(res.data));
  }

  static async setExperimentDataset(projectName: string, experimentId: string, datasetPath: string): Promise<void> {
    if (!store.currentProject) return;

    const reqData: SetExprimentDatasetReq = {
      projectName, experimentId, datasetPath
    }

    const response: AxiosResponse<SetExprimentDatasetRes> = await axios.post(
      host + 'set-experiment-dataset',
      reqData,
    )

    if (response.status !== 200) return;
    const res: SetExprimentDatasetRes = response.data
    if (res.code !== 0) {
      console.log(res.message);
      return;
    }

    const project = store.projectList.get(store.currentProject);
    if (project === undefined) return;

    if (!res.data) return;
    project.experiments?.set(experimentId, res.data)
  }

  static async getDatasets(projectName: string): Promise<void> {

    const reqData: GetDatasetsReq = {
      projectName,
    }
    const response: AxiosResponse<GetDatasetsRes> = await axios.post(
      host + 'get-datasets',
      reqData,
    )

    if (response.status !== 200) return;

    const res: GetDatasetsRes = response.data;
    if (res.code !== 0) {
      console.log(res.message);
      return;
    }

    const project = store.projectList.get(projectName)
    if (project === undefined) return;

    if (!res.data) return;
    project.datasets = new Map<string, DatasetStatus>(Object.entries(res.data))
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
      console.log("res data", res.data);
    }
  }

  static async runExperimentTrain(projectName: string, experimentId: string): Promise<string> {

    const reqData: RunExperimentTrainReq = {
      projectName, experimentId
    }

    const response: AxiosResponse<RunExperimentTrainRes> = await axios.post(
      host + 'run-experiment-train',
      reqData,
    )

    if (response.status !== 200) return "fail";

    const res: RunExperimentTrainRes = response.data;
    if (res.code !== 0) console.log(res.message)

    return res.message
  }

  static async getInformationTrain(): Promise<GetInformationTrainResData> {

    const response: AxiosResponse<GetInformationTrainRes> = await axios.post(
      host + 'get-information-train',
    );

    if (response.status !== 200) return new GetInformationTrainResData

    const res: GetInformationTrainRes = response.data;
    if (res.code !== 0) console.log(res.message)

    if (!res.data) return new GetInformationTrainResData

    return res.data

  }

  static async deleteRun(projectName: string, runId: string): Promise<string> {

    const reqData: DeleteRunReq = {
      projectName, runId
    }

    const response: AxiosResponse<DeleteRunRes> = await axios.post(
      host + 'delete-run',
      reqData
    )

    if (response.status !== 200) return "fail";

    const res: DeleteRunRes = response.data
    if (res.code !== 0 ) console.log(res.message)

    return res.message
  }

}
