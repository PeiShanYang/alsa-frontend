import { Experiment } from "@/io/experiment";

export class GetExperimentsReq {
    projectName!: string;
}

export class GetExperimentsRes {
    code = 0;
    message = '';
    data?: Map<string, Experiment>;
}
