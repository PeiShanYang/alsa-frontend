export class GetInformationTrainRes {
    code = 0;
    message = '';
    data?: GetInformationTrainResData;
}

export class GetInformationTrainResData {
    done: RunTask[] = [];
    work: RunTask[] = [];
}

export class TrainingProcess {
    model = {
        epoch: 0,
        total: 0,
    };
    vaild = {
        accuray: 0
    }
}

export class RunTask {
    experimentId = '';
    process: string | Map<string, TrainingProcess> = '';
    projectName = '';
    runId = '';
    task = '';
}