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
    valid = {
        accuracy: 0,
    }
}

export class TestProcess {
    test = {
        test: {
            accuracy: 0,
        },
    }
}

// {"test":{"test":{"accuracy":1}}}

export class RunTask {
    experimentId = '';
    process!: string | Map<string, TrainingProcess> | TestProcess;
    projectName = '';
    runId = '';
    task = '';
}
