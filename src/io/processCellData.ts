import { Experiment } from "@/io/experiment";
import ProjectSevice from "@/services/project.service";

export default class ProcessCellData {
    component!: string;
    content!: string[];

    static cellDataContent(experiment: Experiment, projectName: string): Map<string, ProcessCellData> {
        return new Map([
            ['dataset-node', {
                component: 'dataset-node',
                content: ProjectSevice.getDatasetNodeContent(experiment.Config.PrivateSetting.datasetPath ?? "", projectName),
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
            ['model-select-node-processing', {
                component: 'model-select-node',
                content: ["進行中"],
            }],
            ['validation-select-node-processing', {
                component: 'validation-select-node',
                content: ["進行中"],
            }],
            ['trained-result-node-processing', {
                component: 'trained-result-node',
                content: ["進行中"],
            }],
            ['test-result-node-processing', {
                component: 'test-result-node',
                content: ["進行中"],
            }],

        ]);
    }

}
