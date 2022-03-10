import { DatasetStatus } from "@/io/dataset";

export class CheckDatasetReq {
    projectName!: string;
    datasetPath!: string;
}

export class CheckDatasetRes {
    code: number = 0;
    message: string = '';
    data?: DatasetStatus;
}
