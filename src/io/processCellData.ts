import { Experiment } from "@/io/experiment";

export default class ProcessCellData {
    component!: string;
    content!: string[];

<<<<<<< HEAD
    static cellDataContent(component: string, experiment: Experiment): ProcessCellData {

        let contentData: string[] = []

        switch (component) {
            case "dataset-node":
                contentData = ["未上傳","未標記","未切分"]
                break;
            case "preprocess-node":
                contentData = Object.keys(experiment.ConfigPreprocess.PreprocessPara)
                break;
            case "data-argument-node":
                contentData = Object.keys(experiment.ConfigAugmentation.AugmentationPara)
                break;
            case "model-select-node":
                contentData.push(experiment.ConfigPytorchModel.SelectedModel.model?.structure ?? '')
                break;
            case "validation-select-node":
                contentData = Object.keys(experiment.ConfigEvaluation.EvaluationPara)
                break;
            case "trained-result-node":
                contentData.push("尚未訓練")
                break;
            case "test-result-node":
                contentData.push("尚未訓練")
                break;
            default:
                break;
        }
        return {
            component,
            content: contentData,
        }
=======
    static cellDataContent(experiment: Experiment): Map<string, ProcessCellData> {
        experiment;
        return new Map([
            ['dataset-node', {
                component: 'dataset-node',
                content: ["dataset:'/'"],
            }],
            ['preprocess-node', {
                component: 'preprocess-node',
                content: [],
            }],
            ['data-argument-node', {
                component: 'data-argument-node',
                content: [],
            }],
            ['model-select-node', {
                component: 'model-select-node',
                content: [],
            }],
            ['validation-select-node', {
                component: 'validation-select-node',
                content: [],
            }],
            ['trained-result-node', {
                component: 'trained-result-node',
                content: [],
            }],
            ['test-result-node', {
                component: 'test-result-node',
                content: [],
            }],
        ]);
>>>>>>> 8cfde832b54693db03ce1562db32557a5a9e1b90
    }

}