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
import { RunExperimentTrainReq, RunExperimentTestReq, RunExperimentRes, RunExperimentData } from "@/io/rest/runExperiment";
import { GetQueueInformationRes, GetQueueInformationResData } from "@/io/rest/getQueueInformation";
import { DeleteRunReq, DeleteRunRes } from "@/io/rest/deleteRun";
import { GetModelInformationReq, GetModelInformationRes, GetModelInformationResData } from "@/io/rest/getModelInformation";
import { DownloadModelReq } from "@/io/rest/downloadModel";
import { StringUtil } from "@/utils/string.util";
import { SetDeployPathData, SetDeployPathReq, SetDeployPathRes } from "@/io/rest/setDeployPath";
import { DeployInfo } from "@/io/deployInfo";
import { DeployReq, DeployRes } from "@/io/rest/deploy";
import { ListFolderRes, ListFolderResData } from "@/io/rest/listFolder";
import { CreateFolderReq, CreateFolderRes } from "@/io/rest/createFolder";
import { RemoveFolderReq, RemoveFolderRes } from "@/io/rest/removeFolder";
import { RenameFolderReq, RenameFolderRes } from "@/io/rest/renameFolder";
import { GetExperimentConfigsRes } from "@/io/rest/getExperimentConfig";
import storeService from "@/services/store.service";
import { SetExperimentsReq, SetExperimentsRes } from "@/io/rest/setExperiments";
import { GetModelDescriptionRes, GetModelDescriptionResData } from "@/io/rest/getModelDescription";


// const host = 'http://tw100104318:37510/';
const host = 'http://tw100104318:65101/';

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
  static async createProjectByKey(name: string, key: string): Promise<boolean> {
    if (key === '.') key = "eyJhbGciOiJIUzI1NiJ9.eyJDb25maWciOnsiUHJpdmF0ZVNldHRpbmciOnsiZGF0YXNldFBhdGgiOiIifX0sIkNvbmZpZ0F1Z21lbnRhdGlvbiI6eyJBdWdtZW50YXRpb25QYXJhIjp7InJhbmRvbUhvcml6b250YWxGbGlwIjp7InN3aXRjaCI6MSwicHJvYmFiaWxpdHkiOjAuNX19fSwiQ29uZmlnRXZhbHVhdGlvbiI6eyJFdmFsdWF0aW9uUGFyYSI6eyJzaG93QWNjIjp7InN3aXRjaCI6MX0sInNob3dDbGFzc0FjYyI6eyJzd2l0Y2giOjF9fX0sIkNvbmZpZ01vZGVsU2VydmljZSI6eyJMb3NzRnVuY3Rpb25QYXJhIjp7Imxvc3NGdW5jdGlvbiI6IkNyb3NzRW50cm9weUxvc3MifSwiTGVhcm5pbmdSYXRlIjp7ImxlYXJuaW5nUmF0ZSI6MC4wMDF9LCJPcHRpbWl6ZXJQYXJhIjp7IkFkYW0iOnsic3dpdGNoIjoxLCJiZXRhcyI6WzAuOSwwLjk5OV0sImVwcyI6MWUtOCwid2VpZ2h0RGVjYXkiOjAuMDAwNSwiYW1zZ3JhZCI6MH19LCJTY2hlZHVsZXJQYXJhIjp7InN0ZXBMUiI6eyJzd2l0Y2giOjEsInN0ZXBTaXplIjoxLCJnYW1tYSI6MC41fX19LCJDb25maWdQcmVwcm9jZXNzIjp7IlByZXByb2Nlc3NQYXJhIjp7Im5vcm1hbGl6ZSI6eyJzd2l0Y2giOjEsIm1vZGUiOjB9fX0sIkNvbmZpZ1B5dG9yY2hNb2RlbCI6eyJTZWxlY3RlZE1vZGVsIjp7Im1vZGVsIjp7InN0cnVjdHVyZSI6ImF1b191bnJlc3RyaWN0ZWRfcG93ZXJmdWxfbW9kZWwiLCJwcmV0cmFpbmVkIjoxfX0sIkNsc01vZGVsUGFyYSI6eyJiYXRjaFNpemUiOjE2LCJlcG9jaHMiOjJ9fSwiQ29uZmlnUmVzdWx0U3RvcmFnZSI6eyJ1bmtub3duRmlsdGVyIjp7InN3aXRjaCI6MCwiZmlsdGVyIjp7InVua25vd24iOjAuOX0sInJldmVyc2UiOjAsInNhdmVDc3YiOjJ9fX0.M_Xlw_Oeb3CedhN6cJEWDjrSEdu04u7vlVQWPjPYosg";
    const reqData: CreateProjectByKeyReq = { name, key };
    const response: AxiosResponse<GetProjectRes> = await axios.post(
      host + 'create-project-by-key',
      reqData,
    );

    if (response.status !== 200) return false;

    const res: GetProjectRes = response.data;
    if (res.code !== 0) {
      console.log(res.message);
      return false;
    }

    if (!res.data) return false

    store.projectList = new Map<string, Project>(
      res.data.projects.map((v) => [v, new Project()])
    );

    return true
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
    if (!res.data) return;

    const project = store.projectList.get(projectName);
    if (project === undefined) return;
    project.experiments = new Map<string, Experiment>(Object.entries(res.data));

  }

  static async setExperiments(projectName: string, experimentId: string, experiment: Experiment): Promise<void> {

    console.log(experiment)

    const reqData: SetExperimentsReq = {
      projectName, experimentId, experiment
    };
    const response: AxiosResponse<SetExperimentsRes> = await axios.post(
      host + 'set-experiments',
      reqData,
    );

    if (response.status !== 200) return;

    const res: SetExperimentsRes = response.data;
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
    if (project.experiments) project.experiments.set(experimentId, res.data)
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

  static async checkDataset(datasetPath: string): Promise<boolean> {
    if (!store.currentProject) return false;

    const reqData: CheckDatasetReq = {
      projectName: store.currentProject,
      datasetPath,
    }
    const response: AxiosResponse<CheckDatasetRes> = await axios.post(
      host + 'check-dataset',
      reqData,
    );

    if (response.status !== 200) return false;

    const res: CheckDatasetRes = response.data;
    if (res.code !== 0) console.log(res.message);

    if (!res.data) return false

    return true
  }

  static async runExperimentTrain(projectName: string, experimentId: string): Promise<RunExperimentData> {

    const reqData: RunExperimentTrainReq = {
      projectName, experimentId
    }

    const response: AxiosResponse<RunExperimentRes> = await axios.post(
      host + 'run-experiment-train',
      reqData,
    )

    if (response.status !== 200) return new RunExperimentData

    const res: RunExperimentRes = response.data;
    if (res.code !== 0) console.log(res.message)

    if (!res.data) return new RunExperimentData

    return res.data
  }

  static async runExperimentTest(projectName: string, experimentId: string, runId: string): Promise<RunExperimentData> {

    const reqData: RunExperimentTestReq = {
      projectName, experimentId, runId
    }

    const response: AxiosResponse<RunExperimentRes> = await axios.post(
      host + 'run-experiment-test',
      reqData,
    )
    if (response.status !== 200) return new RunExperimentData

    const res: RunExperimentRes = response.data;
    if (res.code !== 0) console.log(res.message)

    if (!res.data) return new RunExperimentData

    return res.data

  }

  static async getQueueInformation(): Promise<GetQueueInformationResData> {

    const response: AxiosResponse<GetQueueInformationRes> = await axios.post(
      host + 'get-queue-information',
    );

    if (response.status !== 200) return new GetQueueInformationResData

    const res: GetQueueInformationRes = response.data;
    if (res.code !== 0) console.log(res.message)

    if (!res.data) return new GetQueueInformationResData

    return res.data

  }

  static async removeRunInQueue(projectName: string, runId: string): Promise<string> {

    const reqData: DeleteRunReq = {
      projectName, runId
    }

    const response: AxiosResponse<DeleteRunRes> = await axios.post(
      host + 'remove-run-in-queue',
      reqData
    )

    if (response.status !== 200) return "fail";

    const res: DeleteRunRes = response.data
    if (res.code !== 0) console.log(res.message)

    return res.message
  }

  static async removeRun(projectName: string, runId: string): Promise<string> {
    const reqData: DeleteRunReq = {
      projectName, runId
    }

    const response: AxiosResponse<DeleteRunRes> = await axios.post(
      host + 'remove-run',
      reqData
    )

    if (response.status !== 200) return "fail"

    const res: DeleteRunRes = response.data
    if (res.code !== 0) console.log(res.message)

    return res.message
  }

  static async getModelInformation(projectName: string): Promise<GetModelInformationResData> {

    const reqData: GetModelInformationReq = {
      projectName,
    }

    const response: AxiosResponse<GetModelInformationRes> = await axios.post(
      host + 'get-model-information',
      reqData
    )

    if (response.status !== 200) return new GetModelInformationResData();

    const res: GetModelInformationRes = response.data
    if (res.code !== 0) console.log(res.message)

    if (!res.data) return new GetModelInformationResData();


    return res.data


  }


  static async downloadModel(projectName: string, runId: string, filename: string): Promise<void> {
    const reqData: DownloadModelReq = { projectName, runId, filename };
    const jwtStr: string = StringUtil.encodeObject(reqData);
    const jwtStrParts = jwtStr.split('.');

    // const response: AxiosResponse = await axios.get(
    //   `${host}download-model/${jwtStrParts[0]}/${jwtStrParts[1]}/${jwtStrParts[2]}`,
    //   { responseType: 'blob' }
    // );

    const dom = document.createElement('a');
    dom.href = `${host}download-model/${jwtStrParts[0]}/${jwtStrParts[1]}/${jwtStrParts[2]}`;
    dom.click();
  }

  static async setDeployPath(projectName: string, deployPath: string): Promise<SetDeployPathData | null> {
    const reqData: SetDeployPathReq = { projectName, deployPath }

    const response: AxiosResponse<SetDeployPathRes> = await axios.post(
      host + 'set-deploy-path',
      reqData
    )

    if (response.status !== 200) return null

    const res: SetDeployPathRes = response.data
    if (res.code !== 0) console.log(res.message)

    if (!res.data) return null

    console.log(res.data)

    return res.data

  }

  static async deploy(projectName: string, runId: string, filename: string): Promise<DeployInfo[] | null> {
    const reqData: DeployReq = { projectName, runId, filename }

    const response: AxiosResponse<DeployRes> = await axios.post(
      host + 'deploy',
      reqData
    )

    if (response.status != 200) return null

    const res: DeployRes = response.data
    if (res.code !== 0) console.log(res.message)

    if (!res.data) return null

    return res.data;
  }

  static async sendReport(path: string): Promise<string> {

    if (!path) return ''
    const pathToAppend = path.split('./')[1]

    return `${host}images/${pathToAppend}`;
  }

  // folder select and edit

  static async listFolder(rootPath: string): Promise<ListFolderResData> {

    let reqUrl = ''
    if (rootPath === 'datasets') reqUrl = 'list-dataset-folder'
    if (rootPath === 'deploy') reqUrl = 'list-deploy-folder'

    const response: AxiosResponse<ListFolderRes> = await axios.post(
      host + reqUrl,
    );

    if (response.status !== 200) return new ListFolderResData;

    const res: ListFolderRes = response.data
    if (res.code !== 0) console.log(res.message)

    if (!res.data) return new ListFolderResData;

    return res.data;

  }

  static async createFolder(rootPath: string, root: string, dir: string): Promise<boolean> {

    const reqData: CreateFolderReq = { root, dir }

    let reqUrl = ''
    if (rootPath === 'datasets') reqUrl = 'create-dataset-folder'
    if (rootPath === 'deploy') reqUrl = 'create-deploy-folder'

    const response: AxiosResponse<CreateFolderRes> = await axios.post(
      host + reqUrl,
      reqData
    )

    if (response.status !== 200) return false

    const res: CreateFolderRes = response.data
    if (res.code !== 0) {
      console.log(res.message)
      return false
    }

    return true
  }

  static async removeFolder(rootPath: string, root: string, dir: string): Promise<boolean> {

    const reqData: RemoveFolderReq = { root, dir }

    let reqUrl = ''
    if (rootPath === 'datasets') reqUrl = 'remove-dataset-folder'
    if (rootPath === 'deploy') reqUrl = 'remove-deploy-folder'

    const response: AxiosResponse<RemoveFolderRes> = await axios.post(
      host + reqUrl,
      reqData
    )

    if (response.status !== 200) return false

    const res: RemoveFolderRes = response.data
    if (res.code !== 0) {
      console.log(res.message)
      return false
    }

    return true
  }

  static async renameFolder(rootPath: string, root: string, src: string, dst: string): Promise<boolean> {

    const reqData: RenameFolderReq = { root, src, dst }

    let reqUrl = ''
    if (rootPath === 'datasets') reqUrl = 'rename-dataset-folder'
    if (rootPath === 'deploy') reqUrl = 'rename-deploy-folder'

    const response: AxiosResponse<RenameFolderRes> = await axios.post(
      host + reqUrl,
      reqData
    )

    if (response.status !== 200) return false

    const res: RenameFolderRes = response.data
    if (res.code !== 0) {
      console.log(res.message)
      return false
    }

    return true
  }

  static async getExperimentConfigs(): Promise<void> {

    if (store.experimentConfigs) return

    const response: AxiosResponse<GetExperimentConfigsRes> = await axios.post(host + 'get-experiment-configs')

    if (response.status !== 200) return

    const res: GetExperimentConfigsRes = response.data
    if (res.code !== 0) {
      console.log(res.message)
      return
    }

    storeService.experimentConfigs = res.data
  }

  static async getModelDescription():Promise<Map<string,GetModelDescriptionResData>>{

    const response: AxiosResponse<GetModelDescriptionRes> = await axios.post(
      host + 'get-model-description',
    )

    if (response.status !== 200) return new Map<string,GetModelDescriptionResData>();

    const res: GetModelDescriptionRes = response.data;
    if (res.code !== 0) {
      console.log(res.message);
      return new Map<string,GetModelDescriptionResData>();
    }
    if (!res.data) return new Map<string,GetModelDescriptionResData>();

    return new Map<string,GetModelDescriptionResData>(Object.entries(res.data));
  }
}
