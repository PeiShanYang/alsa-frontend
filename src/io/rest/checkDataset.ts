import Dataset from "@/views/dataset/main";

export class CheckDatasetReq {
    datasetPath! : string;
}
export class CheckDatasetRes {
    code: number = 0;
    message: string = '';
    data?: Dataset;
}