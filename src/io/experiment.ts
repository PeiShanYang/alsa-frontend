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
        AugmentationPara: AugmentationPara
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
        PreprocessPara: PreprocessPara
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

export class PreprocessPara {
    normalize?: {
        mode: number,
        mean?: number[],
        std?: number[],
    };
    resize?: {
        imageSize: number[]
        interpolation: string
    };
    centerCrop?: {
        size: number[]
    };
    pad?: {
        padding:  number[]
        fill?: number[],
        paddingModel: string,
    };
    gaussianBlur?: {
        kernelSize: number[],
        sigma: number
    };
    brightness?: {
        brightness: number,
    };
    contrast?: {
        contrast: number
    };
    saturation?: {
        saturation: number
    };
    hue?: {
        hue: number
    };

    [s: string]: any | ((s: string) => any);
}

export class AugmentationPara{
    randomHorizontalFlip?:{
        probability:number
    };
    randomVerticalFlip?:{
        probability:number
    };
    randomRotation?:{
        degrees:number[]
    };
    randomTranslate?:{
        translate:number[]
    };
    randomScale?:{
        scale:number[]
    };
    randomShear?:{
        shear:number[]
    };
    randomGrayscale?:{
        probability:number
    };
    randomBrightness?:{
        brightness:number[]
    };
    randomContrast?:{
        contrast:number[]
    };
    randomSaturation?:{
        saturation:number[]
    };
    randomHue?:{
        hue:number[]
    };
    randomErasing?:{
        probability:number,
        scale:number[],
        ratio:number[],
        value:number[],
    };
    randomPerspective?:{
        distortion:number,
        probability:number,
        interpolation:string,
        fill:number[],
    }

    [s: string]: any | ((s: string) => any);

}