import { Graph } from "@antv/x6";
import { Experiment } from '@/io/experiment';
import FlowNodeSettings from "./flowNodeSettings";

export default class graphData{
    graph! : Graph | null;
    projectName = '';
    experimentId = '';
    experiment? : Experiment;
    flowInfo!:FlowNodeSettings[];
}