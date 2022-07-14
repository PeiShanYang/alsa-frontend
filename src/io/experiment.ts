export class Experiment {
    Config!: {
        PrivateSetting: {
            datasetPath?: string,
        },
    };
    ConfigAugmentation!: {
        AugmentationPara: AugmentationPara
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
    ConfigPreprocess!: {
        PreprocessPara: PreprocessPara
    };
    ConfigPytorchModel!: {
        ClsModelPara:{
            batchSize:number,
            epochs:number,
        }
        SelectedModel: {
            model:{
                pretrained:boolean,
                structure:string,
            }
        }  
    };
}

export class AugmentationPara {
    randomHorizontalFlip?: {
        switch:boolean,
        probability: number,
    };
    randomVerticalFlip?: {
        switch:boolean,
        probability: number,
    };
    randomRotation?: {
        switch:boolean,
        degrees: number[],
        fill:number[],
    };
    randomTranslate?: {
        switch:boolean,
        translate: number[],
        fill:number[],
    };
    randomScale?: {
        switch:boolean,
        scale: number[],
        fill:number[],
    };
    randomShear?: {
        switch:boolean,
        shear: number[],
        fill:number[],
    };
    randomGrayscale?: {
        switch:boolean,
        probability: number,
    };
    randomBrightness?: {
        switch:boolean,
        brightness: number[],
    };
    randomContrast?: {
        switch:boolean,
        contrast: number[],
    };
    randomSaturation?: {
        switch:boolean,
        saturation: number[],
    };
    randomHue?: {
        switch:boolean,
        hue: number[]
    };
    randomErasing?: {
        switch:boolean,
        probability: number,
        scale: number[],
        ratio: number[],
        value: number[],
    };
    randomPerspective?: {
        switch:boolean,
        distortion: number,
        probability: number,
        interpolation: string,
        fill: number[],
    }

    [s: string]: any | ((s: string) => any);

}

export class OptimizerPara {
    SGD?: {
        switch:boolean,
        momentum: number,
        dampening: number,
        weightDecay: number,
        nesterov: boolean,
    };
    Adam?: {
        switch:boolean,
        betas: number[],
        eps: number,
        weightDecay: number,
        amsgrad: boolean,
    };
    Adadelta?: {
        switch:boolean,
        rho: number,
        eps: number,
        weightDecay: number,
    };
    AdamW?: {
        switch:boolean,
        betas: number[],
        eps: number,
        weightDecay: number,
        amsgrad: boolean,
    };
    NAdam?: {
        switch:boolean,
        betas: number[],
        eps: number,
        weightDecay: number,
        momentumDecay: number,
    };
    [s: string]: any | ((s: string) => any);
}

export class SchedulerPara {
    stepLR?: {
        switch:boolean,
        stepSize: number,
        gamma: number
    };
    cosineAnnealingLR?: {
        switch:boolean,
        tMax: number,
        etaMin: number,
    }
    [s: string]: any | ((s: string) => any);
}

export class PreprocessPara {
    normalize?: {
        switch:boolean,
        mode: string,
        mean?: number[],
        std?: number[],
    };
    resize?: {
        switch:boolean,
        imageSize: number[],
        interpolation: string,
    };
    centerCrop?: {
        switch:boolean,
        size: number[],
    };
    pad?: {
        switch:boolean,
        padding: number[],
        fill?: number[],
        paddingMode: string,
    };
    gaussianBlur?: {
        switch:boolean,
        kernelSize: number[],
        sigma: number,
    };
    brightness?: {
        switch:boolean,
        brightness: number,
    };
    contrast?: {
        switch:boolean,
        contrast: number,
    };
    saturation?: {
        switch:boolean,
        saturation: number,
    };
    hue?: {
        switch:boolean,
        hue: number,
    };

    [s: string]: any | ((s: string) => any);
}



export class EvaluationPara {
    constructor(){
        this.showAcc = false;
        this.showClassAcc = false;
        this.showNumOfClasses = false;
        // this.showWrongFile = false;
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