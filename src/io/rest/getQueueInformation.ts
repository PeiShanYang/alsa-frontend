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
    Train = {
        accuracy: 0,
    }

}

export class TestProcess {
    Test = {
        Test: {
            accuracy: 0,
            classAccuracy: { NG: 0, OK: 0 },
            classCorrect: [],
            className: [],
            classNumbers: [],
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
