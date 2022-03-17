import { Experiment } from "@/io/experiment";
import store from '@/services/store.service';

export default class ProcessCellData {
    component!: string;
    content!: string[];

    static cellDataContent(experiment: Experiment): Map<string, ProcessCellData> {

        const projectDataset = store.projectList.get(store.currentProject ?? "")?.datasets
        const datasetNodeContent: string[] = []
        if (!projectDataset) {
            datasetNodeContent.push("未上傳", "未標記", "未切分")
        } else {
            const getStatus = projectDataset.get(experiment.Config.PrivateSetting.datasetPath ?? "")
            if (getStatus && getStatus.uploaded) {
                datasetNodeContent.push("已上傳")
            } else { datasetNodeContent.push("未上傳") }
            if (getStatus && getStatus.labeled) {
                datasetNodeContent.push("已標記")
            } else { datasetNodeContent.push("未標記") }
            if (getStatus && getStatus.split) {
                datasetNodeContent.push("已切分")
            } else { datasetNodeContent.push("未切分") }
            
        }

        const modelNameArr = []
        modelNameArr.push(experiment.ConfigPytorchModel.SelectedModel.model?.structure ?? '')


        return new Map([
            ['dataset-node', {
                component: 'dataset-node',
                content: datasetNodeContent,
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
                content: modelNameArr,
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