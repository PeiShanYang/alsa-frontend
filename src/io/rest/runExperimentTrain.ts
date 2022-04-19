export class RunExperimentTrainReq {
    projectName!: string;
    experimentId!: string;
}
export class RunExperimentTrainRes {
    code = 0;
    message = '';
    data?: Array<RunExperimentTrainResData>;
}

export class RunExperimentTrainResData {
    experimentId = '';
    projectName = '';
    runId = '';
    task = '';
}