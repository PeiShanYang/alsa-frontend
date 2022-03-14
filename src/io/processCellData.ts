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
                break;
            case "trained-result-node":
                break;
            case "test-result-node":
                break;
            default:
                break;
        }


        // console.log("experiment",experiment)
        return {
            component,
            content: contentData,
        }
    }

}