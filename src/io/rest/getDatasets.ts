import { DatasetStatus } from "@/io/dataset";

export class GetDatasetsReq {
    projectName!: string;
}

export class GetDatasetsRes {
    code = 0;
    message = '';
    data?: Map<string, DatasetStatus>;
}