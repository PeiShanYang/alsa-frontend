export class getInformationTrainRes {
    code = 0;
    message = '';
    data?: getInformationTrainResData;
}

export class getInformationTrainResData {
    experimentId = '';
    process = '';
    projectName = '';
    runId = '';
    task = '';
}