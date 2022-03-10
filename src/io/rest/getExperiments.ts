import { Experiment } from "@/io/experiment";

export class GetExperimentsReq {
    projectName! : string;
}

export class GetExperimentsRes {
    code: number = 0;
    message: string = '';
    data?: Map<string, Experiment>;
}
