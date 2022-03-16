import { Experiment } from "@/io/experiment";

export class SetExprimentDatasetReq {
    projectName!: string;
    experimentId!: string;
    datasetPath!: string
}

export class SetExprimentDatasetRes {
    code = 0;
    message = '';
    data?: Experiment;
}