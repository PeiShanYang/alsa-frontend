type Args = Map<string, ConfigType>
type FuncArgs = Map<string, Map<string, ConfigType>>

export class ConfigType {
    type!: string;
    default!: any;
    max?: number;
    min?: number;
    children?: Args;
}

export class ExperimentConfigs {

    ConfigPreprocess!: { PreprocessPara: FuncArgs }
    ConfigAugmentation!: { AugmentationPara: FuncArgs }
    ConfigEvaluation!: { EvaluationPara: FuncArgs }
    ConfigModelService!: {
        LossFunctionPara: Args,
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
                epoches: ConfigType,
            },
        },
        ConfigResultStorage: { ResultStorage: FuncArgs }
        ConfigPass: Map<string, any>
    }
}