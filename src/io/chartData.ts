export default class chartData{
    projectName = '';
    date = '';
    datasetPath ='';
    model = '';
    lineChartData: { epoch: string, accuracy: number }[] = [];
    ringProgressChartData: { scoreName: string, score: number }[] = [];
}