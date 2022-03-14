import { Experiment } from "@/io/experiment";

export default class ProcessCellData {
    component!: string;
    content!: string[];

    static cellDataContent(component: string, experiment: Experiment): ProcessCellData {

        let contentData: string[] = []

        switch (component) {
            case "dataset-node":
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
    }

}