import { Experiment } from "@/io/experiment";
import ProjectSevice from "@/services/project.service";

export default class ProcessCellData {
    component!: string;
    content!: string[];

    static cellDataContent(experiment: Experiment,projectName:string): Map<string, ProcessCellData> {
        return new Map([
            ['dataset-node', {
                component: 'dataset-node',
                content: ProjectSevice.getDatasetNodeContent(experiment.Config.PrivateSetting.datasetPath ?? "",projectName),
            }],
            ['preprocess-node', {
                component: 'preprocess-node',
                content: Array.from(Object.keys(experiment.ConfigPreprocess.PreprocessPara)),
            }],
            ['data-argument-node', {
                component: 'data-argument-node',
                content: Array.from(Object.keys(experiment.ConfigAugmentation.AugmentationPara)),
            }],
            ['model-select-node', {
                component: 'model-select-node',
                content: ProjectSevice.getModelNodeContent(experiment.ConfigPytorchModel.SelectedModel.model),
            }],
            ['validation-select-node', {
                component: 'validation-select-node',
                content: Array.from(Object.keys(experiment.ConfigEvaluation.EvaluationPara)),
            }],
            ['trained-result-node', {
                component: 'trained-result-node',
                content: ["尚未訓練"],
            }],
            ['test-result-node', {
                component: 'test-result-node',
                content: ["尚未訓練"],
            }],
        ]);
    }

}
