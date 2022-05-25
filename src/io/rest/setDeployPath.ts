import { DeployInfo } from "../deployInfo";

export class SetDeployPathReq {
    projectName!: string;
    deployPath!: string;
}

export class SetDeployPathRes {
    code: number = 0;
    message: string = "";
    data: SetDeployPathData = new SetDeployPathData();
}

export class SetDeployPathData {
    deployPath = "";
    infoList: DeployInfo[] = [];
}
