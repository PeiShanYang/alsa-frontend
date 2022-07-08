type Args = Map<string, ConfigType>
type FuncArgs = Map<string, Map<string, ConfigType>>

export class ConfigType {
    type!: string
    default!: number | string | boolean
    max?: number
    min?: number
    enums?: Map<string, number | string>
    unit?: string
    children?: Args
    display?: string
}

export class ExperimentConfigs {

    ConfigAugmentation!: { AugmentationPara: FuncArgs };
    ConfigModelService!: {
        LossFunctionPara: {
            lossFunction: ConfigType
        },
        LearningRate: {
            learningRate: ConfigType
        },
        OptimizerPara: FuncArgs,
        SchedulerPara: FuncArgs,
    };
    ConfigPreprocess!: { PreprocessPara: FuncArgs }
    ConfigPytorchModel!: {
        ClsModelPara: {
            batchSize: ConfigType,
            epochs: ConfigType,
        },
        SelectedModel: {
            model: {
                pretrained: ConfigType,
                structure: ConfigType,
            },
        },
        ConfigPass: Map<string, any>
    }
}
