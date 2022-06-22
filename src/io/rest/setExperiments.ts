import { Experiment } from "@/io/experiment"

export class SetExperimentsReq {
    projectName!: string
    experimentId!: string
    experiment!: Experiment
}

export class SetExperimentsRes {
    code = 0;
    message = '';
    data?: Map<string, Experiment>;
}
