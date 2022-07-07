export class Experiment {
    Config!: {
        BasicSetting: {
            projectName?: "",
            experimentId?: "",
            task?: "",
        },
        PrivateSetting: {
            datasetPath?: string,
            outputPath?: string,
        },
    };
    ConfigAugmentation!: {
        AugmentationPara: AugmentationPara
    };
    ConfigEvaluation!: {
        EvaluationPara: EvaluationPara
    };
    ConfigModelService!: {
        LossFunctionPara: {
            lossFunction?: string,
        },
        LearningRate: {
            learningRate?: number,
        },
        OptimizerPara: OptimizerPara
        SchedulerPara: SchedulerPara
    };
    ConfigPostprocess!: {
        PostProcessPara: {
            confidenceFilter?: {
                switch: 1,
                threshold: 0.75,
                selectLabel: "OK",
                classList: ["NG", "OK"]
            }
        }
    };
    ConfigPreprocess!: {
        PreprocessPara: PreprocessPara
    };
    ConfigPytorchModel!: {
        SelectedModel: SelectedModel
        // ConfigResultStorage: {
        //     ResultStorage: ResultStorage
        // };
        ConfigPass: {
            confidenceFilter?: false,
            showRate?: false,
            cudaDevice?: 0,
            saveAccJson?: true,
            testAccJson?: true,
            drawAccCurve?: false,
            drawConfusionMatrix?: true,
        }
    };

}

export class PreprocessPara {
    normalize?: {
        switch:number,
        mode: number,
        mean?: number[],
        std?: number[],
    };
    resize?: {
        switch:number,
        imageSize: number[]
        interpolation: string
    };
    centerCrop?: {
        size: number[]
    };
    pad?: {
        padding: number[]
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

export class AugmentationPara {
    randomHorizontalFlip?: {
        probability: number
        switch:number
    };
    randomVerticalFlip?: {
        probability: number
    };
    randomRotation?: {
        degrees: number[]
    };
    randomTranslate?: {
        translate: number[]
    };
    randomScale?: {
        scale: number[]
    };
    randomShear?: {
        shear: number[]
    };
    randomGrayscale?: {
        probability: number
    };
    randomBrightness?: {
        brightness: number[]
    };
    randomContrast?: {
        contrast: number[]
    };
    randomSaturation?: {
        saturation: number[]
    };
    randomHue?: {
        hue: number[]
    };
    randomErasing?: {
        probability: number,
        scale: number[],
        ratio: number[],
        value: number[],
    };
    randomPerspective?: {
        distortion: number,
        probability: number,
        interpolation: string,
        fill: number[],
    }

    [s: string]: any | ((s: string) => any);

}
export class SelectedModel {
    model?: {
        structure: string,
        pretrained: boolean,
    };
    ClsModelPara?: {
        batchSize: number,
        epochs: number,
    };

    [s: string]: any | ((s: string) => any);
}

export class ResultStorage {
    saveFinalWeight?: {
        switch: boolean
    };
    saveAccTxt?: {
        switch: boolean
    };
    savePredictResult?: {
        switch: boolean
    };
    unknownFilter?: {
        switch: boolean,
        filter: {
            name: string,
            threshold: number,
        },
        reverse: boolean,
        saveCsv: number,
    };

    [s: string]: any | ((s: string) => any);
}

export class OptimizerPara {
    SGD?: {
        switch:number,
        momentum: number,
        dampening: number,
        weightDecay: number,
        nesterov: boolean,
    };
    Adam?: {
        betas: number[],
        eps: number,
        weightDecay: number,
        amsgrad: boolean,
    };
    Adadelta?: {
        rho: number,
        eps: number,
        weightDecay: number,
    };
    AdamW?: {
        betas: number[],
        eps: number,
        weightDecay: number,
        amsgrad: boolean,
    };
    NAdam?: {
        betas: number[],
        eps: number,
        weightDecay: number,
        momentumDecay: number,
    };
    [s: string]: any | ((s: string) => any);
}

export class SchedulerPara {
    stepLR?: {
        switch:number,
        stepSize: number,
        gamma: number
    };
    cosineAnnealingLR?: {
        tMax: number,
        etaMin: number,
    }
    [s: string]: any | ((s: string) => any);
}

export class EvaluationPara {
    showAcc?: {
        switch: boolean
    };
    showClassAcc?: {
        switch: boolean
    };
    showNumOfClasses?: {
        switch: boolean
    };
    showWrongFile?: {
        switch: boolean
    }
    [s: string]: any | ((s: string) => any);
}

export class ModelSelectPara {
    modelStructure!: string
    modelPretrained!: boolean
    batchSize!: number
    epochs!: number
    lossFunction!: string
    optimizer!: string
    scheduler!: string
}