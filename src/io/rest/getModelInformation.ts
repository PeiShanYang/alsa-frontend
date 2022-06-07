import { TestProcess, TrainingProcess } from "@/io/rest/getQueueInformation";
import { DeployInfo } from "../deployInfo";

export class GetModelInformationReq {
    projectName!: string;
}

export class GetModelInformationRes {
    code = 0;
    message = '';
    data?: GetModelInformationResData = new GetModelInformationResData();
}

export class GetModelInformationResData {
    deployPath = '';
    deployInfo: DeployInfo[] = [];
    modelList: ModelInfo[] = [];
}

export class ModelInfo {
    projectName = '';
    runId = '';
    model = '';
    datasetPath = '';
    // experiment!: Experiment;
    Test!: TestProcess;
    Train!: Map<string, TrainingProcess>;
}
