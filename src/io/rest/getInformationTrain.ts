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

export class trainingProcess {
    model = {
        epoch: 0,
        total: 0,
    };
    vaild = {
        accuray: 0
    }
}