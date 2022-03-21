import { DatasetStatus } from "@/io/dataset";

export class CheckDatasetReq {
    projectName!: string;
    datasetPath!: string;
}

export class CheckDatasetRes {
    code = 0;
    message = '';
    data?: DatasetStatus;
}
