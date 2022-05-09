import { Component, Vue } from 'vue-property-decorator';
import { Line, RingProgress } from '@antv/g2plot';
import ChartService from "@/services/chart.service";
import chartData from '@/io/chartData';
import { GetInformationTrainResData, RunTask, TrainingProcess } from '@/io/rest/getInformationTrain';
import Api from '@/services/api.service';
import store from '@/services/store.service';
import { StringUtil } from '@/utils/string.util';

@Component
export default class Models extends Vue {

    private resultExit = true;
    private acitveResultCollapse: string[] = [];

    private trainingInfo = new GetInformationTrainResData;
    private charts: { data: chartData, runId: string }[] = [];


    mounted(): void {
        this.$i18n.locale = "zh-tw"
        this.waitGetAllProjectInfo()
    }

    private async waitGetAllProjectInfo(): Promise<void> {

        if (!store.currentProject) return

        const loadingInstance = this.$loading({ target: document.getElementById("mainSection") ?? "" })


        this.trainingInfo = await Api.getInformationTrain()

        this.trainingInfo.done = this.trainingInfo.done.filter(task => task.projectName === store.currentProject)

        if (this.trainingInfo.done.length === 0) {
            loadingInstance.close()
            this.resultExit = false
            return
        }

        await Api.getExperiments(store.currentProject)

        this.trainingInfo.done.forEach(task => {
            if (task.task === "Test") return
            const setting = this.chartSetting(task)
            if (setting) this.charts.push(setting)
            this.acitveResultCollapse.push(task.runId)
        })

        this.$nextTick(() => {

            this.charts.forEach(item => this.renderChart(window.innerWidth, item.data, item.runId))

            loadingInstance.close()

        })



    }

    private chartSetting(taskInfo: RunTask): { data: chartData, runId: string } | undefined {

        const experiment = store.projectList.get(taskInfo.projectName)?.experiments?.get(taskInfo.experimentId)
        if (!experiment) return
        if (!experiment.Config.PrivateSetting.datasetPath) return
        if (!experiment.ConfigPytorchModel.SelectedModel.model?.structure) return

        const modelName = this.$i18n.t(experiment.ConfigPytorchModel.SelectedModel.model?.structure).toString()


        if (typeof taskInfo.process === "string") return

        const process = new Map<string, TrainingProcess>(Object.entries(taskInfo.process))
        const lineChartData: { epoch: string, accuracy: number }[] = []

        process.forEach(item => {
            lineChartData.push({
                epoch: item.model.epoch.toString(),
                accuracy: item.valid.accuracy,
            })
        })

        const lastVaild = [...process.values()][process.size - 1].valid

        const ringProgressChartData: { scoreName: string, score: number }[] = []

        for (const [key, value] of Object.entries(lastVaild)) {
            ringProgressChartData.push({ scoreName: key, score: value })
        }

        return {
            data: {
                projectName: taskInfo.projectName,
                date: StringUtil.formatAddSlash(taskInfo.runId),
                experimentId: taskInfo.experimentId,
                dataset: experiment.Config.PrivateSetting.datasetPath,
                modelName: modelName,
                lineChartData,
                ringProgressChartData,
            },
            runId: taskInfo.runId
        }
    }

    private renderChart(screenWidth: number, dataContent: chartData, runId: string): void {


        const lineChartContainer = document.getElementById(`${runId}_lineChart`)
        if (!lineChartContainer) return

        const lineChart = new Line(lineChartContainer, {
            ...ChartService.getLineChartOption(screenWidth),
            data: dataContent.lineChartData,
        });

        lineChart.render();

        dataContent.ringProgressChartData.forEach(item => {

            const ringProgressContainer = document.getElementById(`${runId}_${item.scoreName}`)
            if (!ringProgressContainer) return

            const ringProgressChart = new RingProgress(ringProgressContainer, {
                ...ChartService.getRingChartOption(screenWidth, item.score, item.scoreName),
                percent: item.score
            })

            ringProgressChart.render()
        })
    }

    private downloadModel() {
        console.log('download model');
        Api.downloadModel('Kinsus', '20220509021537', 'PAD-0509');
    }
}