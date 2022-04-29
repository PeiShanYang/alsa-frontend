import { Line, RingProgress } from '@antv/g2plot';


export default class chartData{
    projectName = '';
    date = '';
    experimentId ='';
    dataset ='';
    modelName = '';
    lineChartData: { epoch: string, accuracy: number }[] = [];
    ringProgressChartData: { scoreName: string, score: number }[] = [];
}