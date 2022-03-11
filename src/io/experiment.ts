export class Experiment {
    Config!: {
        datasetPath: string,
    };
    ConfigPreprocess!: {
        PreprocessPara: {
            imageSize?: number[],
            normalize?: {
                switch: number,
                mode: number,
                mean: number[],
                std: number[],
            },
            brightness?: number,
            blur?: number,
            cutmix?: number,
            mosaic?: number,
        }
    };
    ConfigAugmentation!: {
        AugmentationPara: {
            randomHorizontalFlip?: {
                switch: number,
                probability: number,
            }
            randomVerticalFlip?: {
                switch: number,
                probability: number,
            }
        }
    };
    ConfigModelService!: {
        LossFunctionPara: {
            lossFunction: string,
        },
        LearningRate: {
            learningRate: number,
        },
        OptimizerPara: {
            SGD?: {
                switch: number,
                momentum: number,
                dampening: number,
                weightDecay: number,
                nesterov: number,
            },
            Adam?: {
                switch: number,
                betas: number[],
                eps: number,
                weightDecay: number,
                amsgrad: number,
            },
            Adadelta?: {
                switch: number,
                rho: number,
                eps: number,
                weightDecay: number,
            },
            AdamW?: {
                switch: number,
                betas: number[],
                eps: number,
                weightDecay: number,
                amsgrad: number,
            },
            NAdam?: {
                switch: number,
                betas: number[],
                eps: number,
                weightDecay: number,
                momentumDecay: number,
            },
        }
        SchedulerPara: {
            stepLR?: {
                switch: number,
                step_size: number,
                gamma: number
            },
            cosineAnnealingLR?: {
                switch: number,
                eta_min: number,
            }
        }
    };
    ConfigPytorchModel!: {
        SelectedModel: {
            model: {
                structure: string,
                pretrained: string,
            }
        },
        ClsModelPara?: {
            cudaDevice: number,
            batchSize: number,
            epochs: number,
        }
    };
    ConfigPostprocess!: {
        PostProcessPara: {
            confidenceFilter?: {
                switch: number,
                threshold: number,
                selectLabel: number,
                classList: string[]
            }
        }
    };
    ConfigEvaluation!: {
        EvaluationPara: {
            showAcc?: number,
            showClassAcc?: number,
            showNumOfClasses?: number,
            showRate?: {
                switch: number,
                targetIndex: string,
            },
            showWrongFile?: number,
        }
    };
    ConfigResultStorage!: {
        ResultStorage: {
            saveFinalWeight?: number,
            saveCheckpoint?: {
                switch: number,
                saveIter: number,
            },
            saveAccTxt?: number,
            drawAccCurve?: number,
            drawConfusionMatrix?: number,
        }
    };
}