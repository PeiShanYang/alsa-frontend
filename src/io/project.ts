import { Experiment } from "@/io/experiment";
import { DatasetStatus } from "./dataset";

export class Project {
    name!: string;
    fav?: boolean;

    experiments?: Map<string, Experiment>;
    datasets?: Map<string, DatasetStatus>;
}
