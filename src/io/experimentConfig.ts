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

    ConfigPreprocess!: { PreprocessPara: FuncArgs }
    ConfigAugmentation!: { AugmentationPara: FuncArgs }
    ConfigEvaluation!: { EvaluationPara: FuncArgs }
    ConfigModelService!: {
        LossFunctionPara: {
            lossFunction: ConfigType
        },
        LearningRate: Args,
        OptimizerPara: FuncArgs,
        SchedulerPara: FuncArgs,
    }
    ConfigPytorchModel!: {
        SelectedModel: {
            model: {
                structure: ConfigType,
                pretrained: ConfigType,
            },
            ClsModelPara: {
                batchSize: ConfigType,
                epochs: ConfigType,
            },
        },
        // ConfigResultStorage: { ResultStorage: FuncArgs }
        ConfigPass: Map<string, any>
    }
}
