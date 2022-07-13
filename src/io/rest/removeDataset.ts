import { DatasetStatus } from "@/io/dataset";

export class RemoveDatasetReq {
    projectName!: string;
    datasetPath!: string;
}

export class RemoveDatasetRes {
    code = 0;
    message = '';
    data?: Map<string, DatasetStatus>;
}
