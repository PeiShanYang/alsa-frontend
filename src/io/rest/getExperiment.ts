import { Experiment } from "@/io/experiment";

export class GetExperimentReq {
    projectName! : string;
}

export class GetExperimentRes {
    code: number = 0;
    message: string = '';
    data?: Experiment;
}

