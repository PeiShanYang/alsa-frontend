import { Experiment } from "@/io/experiment";
import store from '@/services/store.service';

export default class ProjectSevice {

    static getDatasetNodeContent(experiment: Experiment): string[] {

        const datasetStatus = store.projectList
            .get(store.currentProject ?? "")
            ?.datasets
            ?.get(experiment.Config.PrivateSetting.datasetPath ?? "");

        if (!datasetStatus) return ["未上傳", "未標記", "未切分"];

        return [
            datasetStatus.uploaded ? "已上傳" : "未上傳",
            datasetStatus.labeled ? "已標記" : "未標記",
            datasetStatus.split ? "已切分" : "未切分",
        ];
    }

    static getModelNodeContent(experiment: Experiment): string[] {

        return [experiment.ConfigPytorchModel.SelectedModel.model?.structure ?? 'Model not set'];
    }

}