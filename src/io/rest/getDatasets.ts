import { DatasetStatus } from "../dataset";

export class GetDatasetsReq {
    projectName!: string;
}

export class GetDatasetsRes {
    code = 0;
    message = '';
    data?: Map<string, DatasetStatus>;
}