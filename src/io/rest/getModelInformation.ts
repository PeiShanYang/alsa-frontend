import { TestProcess, TrainingProcess } from "@/io/rest/getInformationTrain";

export class GetModelInformationReq {
    projectName!: string;
}

export class GetModelInformationRes {
    code = 0;
    message = '';
    data?: GetModelInformationResData[] = [];
}

export class GetModelInformationResData {
    projectName = '';
    runId = '';
    model = '';
    datasetPath = '';
    Test!: TestProcess;
    Train!: Map<string, TrainingProcess>;
}
