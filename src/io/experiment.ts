export class Experiment {
    Config!: {
        BasicSetting: {
            projectName?: "",
            experimentId?: "",
            task?: "",
        },
        PrivateSetting: {
            datasetPath?: "",
            outputPath?: string,
        }
    };
    ConfigAugmentation!: {
        AugmentationPara: {
            randomHorizontalFlip?: {
                switch: 1,
                probability: 0.5,
            }
            randomVerticalFlip?: {
                switch: 0,
                probability: 0.5,
            }
        }
    };
    ConfigEvaluation!: {
        EvaluationPara: {
            showAcc?: 1,
            showClassAcc?: 1,
            showNumOfClasses?: 0,
            showRate?: {
                switch: 0,
                targetIndex: "OK",
            },
            showWrongFile?: 0,
        }
    };
    ConfigModelService!: {
        LossFunctionPara: {
            lossFunction?: "CrossEntropyLoss",
        },
        LearningRate: {
            learningRate?: 0.001,
        },
        OptimizerPara: {
            SGD?: {
                switch: 0,
                momentum: 0.9,
                dampening: 0,
                weightDecay: 5e-4,
                nesterov: 0,
            },
            Adam?: {
                switch: 1,
                betas: [0.9, 0.999],
                eps: 1e-8,
                weightDecay: 5e-4,
                amsgrad: 0,
            },
            Adadelta?: {
                switch: 0,
                rho: 0.9,
                eps: 1e-6,
                weightDecay: 0,
            },
            AdamW?: {
                switch: 0,
                betas: [0.9, 0.999],
                eps: 1e-8,
                weightDecay: 0.01,
                amsgrad: 0,
            },
            NAdam?: {
                switch: 0,
                betas: [0.9, 0.999],
                eps: 1e-8,
                weightDecay: 0,
                momentumDecay: 0.004,
            },
        }
        SchedulerPara: {
            stepLR?: {
                switch: 1,
                step_size: 10,
                gamma: 0.1
            },
            cosineAnnealingLR?: {
                switch: 0,
                tMax: string,
                etaMin: 0,
            }
        }
    };
    ConfigPostprocess!: {
        PostProcessPara: {
            confidenceFilter?: {
                switch: 1,
                threshold: 0.75,
                selectLabel: "OK",
                classList: ["NG","OK"]
            }
        }
    };
    ConfigPreprocess!: {
        PreprocessPara: {
            normalize?: {
                switch: 1,
                mode: 0,
                mean: number[],
                std: number[],
            },
            imageSize?: [224,224],
        }
    };
    ConfigPytorchModel!: {
        SelectedModel: {
            model?: {
                structure: "auo_mmfa_model",
                pretrained: 1,
            }
        },
        ClsModelPara: {
            cudaDevice?: 0,
            batchSize?: 16,
            epochs?: 2,
        },
        ClsPath:{
            trainPath?:string,
            validPath?:string,
            testPath?:string,
            inferencePath?:string,
            pretrainedWeight?:string,
            weigthPath?:string,
            saveFinalWeight?:0,
        }
    };
    ConfigResultStorage!: {
        ResultStorage: {
            saveFinalWeight?: 0,
            saveCheckpoint?: {
                switch: 0,
                saveIter: 1,
            },
            saveAccTxt?: 0,
            drawAccCurve?: 0,
            drawConfusionMatrix?: 0,
        }
    };
}