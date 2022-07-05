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
            ['augmentation-node', {
                component: 'augmentation-node',
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
                content: ["notTraining"],
            }],
            ['test-result-node', {
                component: 'test-result-node',
                content: ["notTraining"],
            }],
            ['dataset-node-processing', {
                component: 'dataset-node',
                content: ["training"],
            }],
            ['preprocess-node-processing', {
                component: 'preprocess-node',
                content: ["training"],
            }],
            ['augmentation-node-processing', {
                component: 'augmentation-node',
                content: ["training"],
            }],
            ['model-select-node-processing', {
                component: 'model-select-node',
                content: ["training"],
            }],
            ['validation-select-node-processing', {
                component: 'validation-select-node',
                content: ["training"],
            }],
            ['trained-result-node-processing', {
                component: 'trained-result-node',
                content: ["training"],
            }],
            ['test-result-node-processing', {
                component: 'test-result-node',
                content: ["training"],
            }],

        ]);
    }

}
