export class RunExperimentTrainReq {
    projectName!: string;
    experimentId!: string;
}

export class RunExperimentTestReq{
    projectName!:string;
    experimentId!:string;
    runId!:string;
}
export class RunExperimentRes {
    code = 0;
    message = '';
    data: RunExperimentData = new RunExperimentData;
}

export class RunExperimentData {
    experimentId = '';
    projectName = '';
    runId = '';
    task = '';
}