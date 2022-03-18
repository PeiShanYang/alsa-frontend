import { Experiment } from "@/io/experiment";
import store from '@/services/store.service';

export default class ProjectSevice {

    static getDatasetNodeContent(experiment: Experiment): string[] {

        let datasetNodeContent: string[] = []

        const projectDataset = store.projectList.get(store.currentProject ?? "")?.datasets
        if (!projectDataset) {
            datasetNodeContent = ["未上傳", "未標記", "未切分"]
        } else {
            const getStatus = projectDataset.get(experiment.Config.PrivateSetting.datasetPath ?? "")

            getStatus && getStatus.uploaded ? datasetNodeContent.push("已上傳") : datasetNodeContent.push("未上傳")
            getStatus && getStatus.labeled ? datasetNodeContent.push("已標記") : datasetNodeContent.push("未標記")
            getStatus && getStatus.split ? datasetNodeContent.push("已切分") : datasetNodeContent.push("未切分")
        }
        return datasetNodeContent
    }

    static getModelNodeContent(experiment: Experiment): string[] {

        const modelNodeContent: string[] = []
        modelNodeContent.push(experiment.ConfigPytorchModel.SelectedModel.model?.structure ?? '')
        return modelNodeContent
    }

}