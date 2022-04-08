import store from '@/services/store.service';

export default class ProjectSevice {

    static getDatasetNodeContent(datasetPath: string,projectName:string): string[] {

        const datasetStatus = store.projectList
            .get(projectName)
            ?.datasets
            ?.get(datasetPath);

        if (datasetStatus) return [
            datasetStatus.uploaded ? "已上傳" : "未上傳",
            datasetStatus.labeled ? "已標記" : "未標記",
            datasetStatus.split ? "已切分" : "未切分",
        ];
        return ["未上傳", "未標記", "未切分"];
    }

    static getModelNodeContent(model: { pretrained: number, structure: string } | undefined): string[] {
        return [model ? model.structure : 'Model not set'];
    }

}