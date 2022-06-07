export class GetQueueInformationRes {
    code = 0;
    message = '';
    data?: GetQueueInformationResData;
}

export class GetQueueInformationResData {
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
            classAccuracy: new Map<string, number>(),
            ConfusionMatrix:'',
        },
    }
}

export class RunTask {
    experimentId = '';
    process!: string | Map<string, TrainingProcess> | TestProcess;
    projectName = '';
    runId = '';
    task = '';
}
