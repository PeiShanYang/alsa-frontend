import { Experiment } from "@/io/experiment";

export default class ProcessCellData {
    component!: string;
    content!: string[];

    static ofPostProcess(component: string, experiment: Experiment): ProcessCellData {
        return {
            component,
            content: [],
        }
    }
}