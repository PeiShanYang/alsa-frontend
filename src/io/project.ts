import { Experiment } from "@/io/experiment";

export class Project {
    name!: string;
    fav?: boolean;

    experiments?: Map<string, Experiment>;
}
