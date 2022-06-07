import { DeployInfo } from "../deployInfo";

export class DeployReq {
    projectName!: string;
    runId!: string;
    filename = '';
}

export class DeployRes {
    code = 0;
    message = '';
    data: DeployInfo[] = [];
}