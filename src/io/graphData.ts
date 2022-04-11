import { Graph } from "@antv/x6";
import { Experiment } from '@/io/experiment';

export default class graphData{
    graph! : Graph | null;
    projectName = '';
    experimentId = '';
    experiment! : Experiment;
}