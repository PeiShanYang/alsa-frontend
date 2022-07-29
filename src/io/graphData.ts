import { Graph } from "@antv/x6";
import { Experiment } from '@/io/experiment';
import ProcessCellData from "./processCellData";

export default class graphData{
    graph! : Graph | null;
    projectName = '';
    experimentId = '';
    date = '';
    experiment? : Experiment;
    cellData!:Map<string, ProcessCellData>;
    taskRunning = false;
}