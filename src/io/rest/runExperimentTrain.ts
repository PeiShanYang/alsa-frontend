export class runExperimentTrainReq {
    projectName!: string;
    experimentId!: string;
}
export class runExperimentTrainRes {
    code = 0;
    message = '';
    data?: Array<runExperimentTrainResData>;
}

export class runExperimentTrainResData {
    experimentId = '';
    projectName = '';
    runId = '';
    task = '';
}