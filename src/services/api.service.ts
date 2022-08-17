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
import Logger from "@/services/log.service";
import { RemoveDatasetReq, RemoveDatasetRes } from "@/io/rest/removeDataset";
import { RemoveProjectReq, RemoveProjectRes } from "@/io/rest/removeProject";
import { LoginReq, LoginRes } from "@/io/rest/login";
import { AxiosUtils } from "@/utils/axios.utils";
import { ChangePasswordReq, ChangePasswordRes } from "@/io/rest/changePassword";
import { UsersAllRes } from "@/io/rest/usersAll";
import { UsersGlobal, UsersProject } from "@/io/users";
import { AddUserReq, AddUserRes } from "@/io/rest/addUser";
import { RemoveUserReq, RemoveUserRes } from "@/io/rest/removeUser";
import { ModifyUserReq, ModifyUserRes } from "@/io/rest/modifyUser";
import { UsersProjectReq, UsersProjectRes } from "@/io/rest/usersProject";
import { SetProjectUserReq, SetProjectUserRes } from "@/io/rest/setProjectUser";
import { RefreshTokenRes } from "@/io/rest/refreshToken";
import { GetModelPreTrainedWeightReq, GetModelPreTrainedWeightRes } from "@/io/rest/getModelPreTrainedWeight";


// const host = 'http://tw100104318:37510/';
// const host = 'http://tw100104318:65101/';
// const host = 'https://adt-sala.azurewebsites.net:5000/'
const host = 'http://localhost:5000/'


export default class Api {
  static async getProjects(): Promise<void> {
    const response = await axios.post(
      host + 'get-projects',
      {},
      AxiosUtils.bearearToken(),
    );

    if (response.status !== 200) return;

    const res: GetProjectRes = response.data;
    if (res.code !== 0) {
      console.log(res.message);
      return;
    }

    if (!res.data) return

    const resProjects = new Map<string, string>(Object.entries(res.data.projects))

    const projectList: [string, Project][] = []
    resProjects.forEach((auth, name) => {
      const project = new Project()
      project.name = name
      project.auth = auth
      projectList.push([name, project])
    })

    storeService.projectList = new Map<string, Project>(projectList)

  }
  static async createProjectByKey(name: string, key: string): Promise<boolean> {
    if (key === '.') key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDb25maWciOnsiUHJpdmF0ZVNldHRpbmciOnsiZGF0YXNldFBhdGgiOiIifX0sIkNvbmZpZ0F1Z21lbnRhdGlvbiI6eyJBdWdtZW50YXRpb25QYXJhIjp7InJhbmRvbUhvcml6b250YWxGbGlwIjp7InN3aXRjaCI6MSwicHJvYmFiaWxpdHkiOjAuNX19fSwiQ29uZmlnTW9kZWxTZXJ2aWNlIjp7Ikxvc3NGdW5jdGlvblBhcmEiOnsibG9zc0Z1bmN0aW9uIjoiQ3Jvc3NFbnRyb3B5TG9zcyJ9LCJMZWFybmluZ1JhdGUiOnsibGVhcm5pbmdSYXRlIjowLjAwMX0sIk9wdGltaXplclBhcmEiOnsiU0dEIjp7InN3aXRjaCI6MSwibW9tZW50dW0iOjAuOSwiZGFtcGVuaW5nIjowLCJ3ZWlnaHREZWNheSI6MC4wMDA1LCJuZXN0ZXJvdiI6MH19LCJTY2hlZHVsZXJQYXJhIjp7InN0ZXBMUiI6eyJzd2l0Y2giOjEsInN0ZXBTaXplIjoxLCJnYW1tYSI6MC41fX19LCJDb25maWdQcmVwcm9jZXNzIjp7IlByZXByb2Nlc3NQYXJhIjp7Im5vcm1hbGl6ZSI6eyJzd2l0Y2giOjEsIm1vZGUiOiJJbWFnZU5ldCJ9LCJyZXNpemUiOnsic3dpdGNoIjoxLCJpbWFnZVNpemUiOlsyMjQsMjI0XSwiaW50ZXJwb2xhdGlvbiI6IkJJTElORUFSIn19fSwiQ29uZmlnUHl0b3JjaE1vZGVsIjp7IlNlbGVjdGVkTW9kZWwiOnsibW9kZWwiOnsic3RydWN0dXJlIjoiYXVvX3VucmVzdHJpY3RlZF9wb3dlcmZ1bF9tb2RlbCIsInByZXRyYWluZWQiOjF9fSwiQ2xzTW9kZWxQYXJhIjp7ImJhdGNoU2l6ZSI6MTYsImVwb2NocyI6MTB9fX0.27ROd91Ailzl86kLppHCMpA2q0n_HUrJrqA6FALxqsw";
    const reqData: CreateProjectByKeyReq = { name, key };
    const response: AxiosResponse<GetProjectRes> = await axios.post(
      host + 'create-project-by-key',
      reqData,
      AxiosUtils.bearearToken(),
    );

    if (response.status !== 200) return false;

    const res: GetProjectRes = response.data;
    if (res.code !== 0) {
      console.log(res.message);
      return false;
    }
    return true
  }

  static async removeProject(projectName: string): Promise<string> {

    const reqData: RemoveProjectReq = { projectName }
    const response: AxiosResponse<RemoveProjectRes> = await axios.post(
      host + 'remove-project',
      reqData,
      AxiosUtils.bearearToken(),
    )

    if (response.status != 200) return "request fail"

    const res: RemoveProjectRes = response.data;

    return res.message
  }

  static async getExperiments(projectName: string): Promise<void> {

    const reqData: GetExperimentsReq = {
      projectName,
    };
    const response: AxiosResponse<GetExperimentsRes> = await axios.post(
      host + 'get-experiments',
      reqData,
      AxiosUtils.bearearToken(),
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

    Logger.log(experiment)

    const reqData: SetExperimentsReq = {
      projectName, experimentId, experiment
    };
    const response: AxiosResponse<SetExperimentsRes> = await axios.post(
      host + 'set-experiments',
      reqData,
      AxiosUtils.bearearToken(),
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
      AxiosUtils.bearearToken(),
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
      AxiosUtils.bearearToken(),
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

  static async checkDataset(datasetPath: string): Promise<string> {
    if (!store.currentProject) return 'Current project does not exist';

    const reqData: CheckDatasetReq = {
      projectName: store.currentProject,
      datasetPath,
    }
    const response: AxiosResponse<CheckDatasetRes> = await axios.post(
      host + 'check-dataset',
      reqData,
      AxiosUtils.bearearToken(),
    );

    if (response.status !== 200) return "connection error";

    const res: CheckDatasetRes = response.data;

    return res.message
  }

  static async removeDataset(datasetPath: string): Promise<Map<string, DatasetStatus> | undefined> {
    if (!store.currentProject) return;

    const reqData: RemoveDatasetReq = {
      projectName: store.currentProject,
      datasetPath,
    }

    const response: AxiosResponse<RemoveDatasetRes> = await axios.post(
      host + 'remove-dataset',
      reqData,
      AxiosUtils.bearearToken(),
    )

    if (response.status !== 200) return;

    const res: RemoveDatasetRes = response.data
    if (res.code !== 0) console.log(res.message);

    if (!res.data) return;
    return new Map<string, DatasetStatus>(Object.entries(res.data))
  }

  static async runExperimentTrain(projectName: string, experimentId: string): Promise<RunExperimentData> {

    const reqData: RunExperimentTrainReq = {
      projectName, experimentId
    }

    const response: AxiosResponse<RunExperimentRes> = await axios.post(
      host + 'run-experiment-train',
      reqData,
      AxiosUtils.bearearToken(),
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
      AxiosUtils.bearearToken(),
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
      {},
      AxiosUtils.bearearToken(),
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
      reqData,
      AxiosUtils.bearearToken(),
    )

    if (response.status !== 200) return "request fail";

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
      reqData,
      AxiosUtils.bearearToken(),
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
      reqData,
      AxiosUtils.bearearToken(),
    )

    if (response.status !== 200) return new GetModelInformationResData();

    const res: GetModelInformationRes = response.data
    if (res.code !== 0) console.log(res.message)

    if (!res.data) return new GetModelInformationResData();


    return res.data


  }


  static async downloadModel(projectName: string, runId: string, filename: string): Promise<Blob | string> {
    const reqData: DownloadModelReq = { projectName, runId, filename };
    const jwtStr: string = StringUtil.encodeObject(reqData);
    const jwtStrParts = jwtStr.split('.');

    const response: AxiosResponse = await axios.get(
      `${host}download-model/${jwtStrParts[0]}/${jwtStrParts[1]}/${jwtStrParts[2]}`,
      { ...AxiosUtils.bearearToken(), responseType: 'blob' },
    )

    if (response.status !== 200) return 'connection error'

    return response.data

    // const dom = document.createElement('a');
    // dom.href = `${host}download-model/${jwtStrParts[0]}/${jwtStrParts[1]}/${jwtStrParts[2]}`;
    // dom.click();
  }

  static async setDeployPath(projectName: string, deployPath: string): Promise<SetDeployPathData | string> {
    const reqData: SetDeployPathReq = { projectName, deployPath }

    const response: AxiosResponse<SetDeployPathRes> = await axios.post(
      host + 'set-deploy-path',
      reqData,
      AxiosUtils.bearearToken(),
    )

    if (response.status !== 200) return 'connection error'

    const res: SetDeployPathRes = response.data
    if (res.code !== 0) {
      console.log(res.message)
      return res.message
    }

    if (!res.data) return res.message

    Logger.log(res.data)

    return res.data

  }

  static async deploy(projectName: string, runId: string, filename: string): Promise<DeployInfo[] | null> {
    const reqData: DeployReq = { projectName, runId, filename }

    const response: AxiosResponse<DeployRes> = await axios.post(
      host + 'deploy',
      reqData,
      AxiosUtils.bearearToken(),
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
      {},
      AxiosUtils.bearearToken(),
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
      reqData,
      AxiosUtils.bearearToken(),
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
      reqData,
      AxiosUtils.bearearToken(),
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
      reqData,
      AxiosUtils.bearearToken(),
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

    const response: AxiosResponse<GetExperimentConfigsRes> = await axios.post(
      host + 'get-experiment-configs',
      {},
      AxiosUtils.bearearToken(),
    )

    if (response.status !== 200) return

    const res: GetExperimentConfigsRes = response.data
    if (res.code !== 0) {
      console.log(res.message)
      return
    }

    storeService.experimentConfigs = res.data
  }

  static async getModelPreTrainedWeight(model: string): Promise<boolean> {

    const reqData: GetModelPreTrainedWeightReq = { model }

    const response: AxiosResponse<GetModelPreTrainedWeightRes> = await axios.post(
      host + 'get-model-pretrained-weight',
      reqData,
      AxiosUtils.bearearToken(),
    )
    if (response.status !== 200) return false

    const res: GetModelPreTrainedWeightRes = response.data

    if (res.code !== 0) {
      console.log(res.message)
      return false
    }

    if (!res.data) return false
    return res.data

  }

  static async getModelDescription(): Promise<Map<string, GetModelDescriptionResData>> {

    const response: AxiosResponse<GetModelDescriptionRes> = await axios.post(
      host + 'get-model-description',
      {},
      AxiosUtils.bearearToken(),
    )

    if (response.status !== 200) return new Map<string, GetModelDescriptionResData>();

    const res: GetModelDescriptionRes = response.data;
    if (res.code !== 0) {
      console.log(res.message);
      return new Map<string, GetModelDescriptionResData>();
    }
    if (!res.data) return new Map<string, GetModelDescriptionResData>();

    return new Map<string, GetModelDescriptionResData>(Object.entries(res.data));
  }

  //login and auth system

  static async login(username: string, password: string, remember: boolean): Promise<string> {

    const reqData: LoginReq = {
      username, password
    }

    const response: AxiosResponse<LoginRes> = await axios.post(
      host + 'login',
      reqData,
    )

    if (response.status !== 200) return 'connection error'

    const res: LoginRes = response.data
    if (res.code !== 0) {
      console.log(res.message)
      return res.message
    }
    if (!res.data) return res.message

    storeService.userInfo.token = res.data

    if (remember) {
      document.cookie = `salaCookies=${res.data}; path=/;`
    } else {
      const date = new Date()
      const oneDayExpire = date.getTime() + 1000 * 60 * 60 * 24
      date.setTime(oneDayExpire)
      const expires = `expires=${date.toUTCString()};`
      document.cookie = `salaCookies=${res.data}; path=/; ${expires}`
    }
    return res.message
  }

  static async refreshToken(): Promise<string> {

    const response: AxiosResponse<RefreshTokenRes> = await axios.post(
      host + 'refresh-token',
      {},
      AxiosUtils.bearearToken(),
    )

    if (response.status !== 200) return 'connection error'

    const res: RefreshTokenRes = response.data
    if (res.code !== 0) {
      console.log(res.message)
      return res.message
    }

    if (!res.data) return "There is no data."

    storeService.userInfo = res.data

    return res.message

  }


  static async usersAll(): Promise<UsersGlobal> {

    const response: AxiosResponse<UsersAllRes> = await axios.post(
      host + 'users/all',
      {},
      AxiosUtils.bearearToken(),
    )

    if (response.status !== 200) return new UsersGlobal
    const res: UsersAllRes = response.data
    if (res.code !== 0) {
      console.log(res.message)
      return new UsersGlobal
    }

    if (!res.data) return new UsersGlobal
    return res.data
  }

  static async addUser(username: string, password: string, maintainer: boolean): Promise<string> {

    const reqData: AddUserReq = { username, password, maintainer }

    const response: AxiosResponse<AddUserRes> = await axios.post(
      host + 'add-user',
      reqData,
      AxiosUtils.bearearToken(),
    )

    if (response.status !== 200) return 'connection error'
    const res: AddUserRes = response.data
    if (res.code !== 0) {
      console.log(res.message)
      return res.message
    }
    return res.message
  }

  static async removeUser(username: string): Promise<string> {

    const reqData: RemoveUserReq = { username }

    const response: AxiosResponse<RemoveUserRes> = await axios.post(
      host + 'remove-user',
      reqData,
      AxiosUtils.bearearToken(),
    )

    if (response.status !== 200) return 'connection error'
    const res: RemoveUserRes = response.data
    if (res.code !== 0) {
      console.log(res.message)
      return res.message
    }
    return res.message
  }

  static async modifyUser(username: string, isMaintainer: boolean): Promise<string> {

    const reqData: ModifyUserReq = { username, isMaintainer }

    const response: AxiosResponse<ModifyUserRes> = await axios.post(
      host + 'modify-user',
      reqData,
      AxiosUtils.bearearToken(),
    )
    if (response.status !== 200) return 'connection error'
    const res: ModifyUserRes = response.data

    if (res.code !== 0) {
      console.log(res.message)
      return res.message
    }
    return res.message

  }

  static async usersProject(projectName: string): Promise<UsersProject> {

    const reqData: UsersProjectReq = { projectName }
    const response: AxiosResponse<UsersProjectRes> = await axios.post(
      host + 'users/project',
      reqData,
      AxiosUtils.bearearToken(),
    )
    if (response.status !== 200) return new UsersProject
    const res: UsersProjectRes = response.data

    if (res.code !== 0) {
      console.log(res.message)
      return new UsersProject
    }
    if (!res.data) return new UsersProject
    return res.data

  }

  static async addProjectUser(projectName: string, username: string, auth: string): Promise<string> {

    const reqData: SetProjectUserReq = { projectName, username, auth }
    const response: AxiosResponse<SetProjectUserRes> = await axios.post(
      host + 'add-project-user',
      reqData,
      AxiosUtils.bearearToken(),
    )
    if (response.status !== 200) return 'connection error'

    const res: SetProjectUserRes = response.data
    return res.message
  }

  static async removeProjectUser(projectName: string, username: string, auth: string): Promise<string> {
    const reqData: SetProjectUserReq = { projectName, username, auth }
    const response: AxiosResponse<SetProjectUserRes> = await axios.post(
      host + 'remove-project-user',
      reqData,
      AxiosUtils.bearearToken(),
    )
    if (response.status !== 200) return 'connection error'

    const res: SetProjectUserRes = response.data
    return res.message
  }

  static async modifyProjectUser(projectName: string, username: string, auth: string): Promise<string> {
    const reqData: SetProjectUserReq = { projectName, username, auth }
    const response: AxiosResponse<SetProjectUserRes> = await axios.post(
      host + 'modify-project-user',
      reqData,
      AxiosUtils.bearearToken(),
    )
    if (response.status !== 200) return 'connection error'

    const res: SetProjectUserRes = response.data
    return res.message
  }

  static async changePassword(originPassword: string, password: string): Promise<string> {

    const reqData: ChangePasswordReq = { originPassword, password }
    const response: AxiosResponse<ChangePasswordRes> = await axios.post(
      host + 'change-password',
      reqData,
      AxiosUtils.bearearToken(),
    )

    if (response.status !== 200) return 'connection error'

    const res: ChangePasswordRes = response.data

    return res.message
  }

}
