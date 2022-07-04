import store from '@/services/store.service';

export default class ProjectSevice {

    static getDatasetNodeContent(datasetPath: string,projectName:string): string[] {
        const datasetStatus = store.projectList
            .get(projectName)
            ?.datasets
            ?.get(datasetPath);

        if (datasetStatus) return [
            datasetStatus.uploaded ? "uploaded" : "notUploaded",
            datasetStatus.labeled ? "labeled" : "notLabeled",
            datasetStatus.split ? "split" : "notSplit",
        ];
        return ["notUploaded","notLabeled", "notSplit"];
    }

    static getModelNodeContent(model: { pretrained: boolean, structure: string } | undefined): string[] {
        return [model ? model.structure : 'Model not set'];
    }

}