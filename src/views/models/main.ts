import { Component, Vue } from 'vue-property-decorator';
import { Line, RingProgress } from '@antv/g2plot';
import ChartService from "@/services/chart.service";
import chartData from '@/io/chartData';
import { TrainingProcess } from '@/io/rest/getQueueInformation';
import Api from '@/services/api.service';
import store from '@/services/store.service';
import { StringUtil } from '@/utils/string.util';
import { ModelInfo } from '@/io/rest/getModelInformation';
import DialogMessage from '@/components/dialog-message/DialogMessage.vue';
import DialogMessageData from '@/io/dialogMessageData';
import storeService from '@/services/store.service';
import { DeployInfo } from '@/io/deployInfo';

class Chart {
    data!: chartData;
    runId!: string;
    isCurrentVersion = false;
    deployBtnName = '部署此模型';
    deployInfoMsg: string[] = [];
}

@Component({
    components: {
        "dialog-message": DialogMessage,
    }
})
export default class Models extends Vue {

    private resultExit = true;
    private inputDeployPath = '';

    private acitveResultCollapse: string[] = [];

    private charts: Chart[] = [];

    private deployInfo: DeployInfo[] = [];

    private openDialogMessage = false;
    private dialogMessageData: DialogMessageData = new DialogMessageData()
    private downloadInfo = { runId: '' }

    private setDeployPathDialog = false;
    private setDeployPathDialogData = new DialogMessageData()

    private deployDialog = false;
    private deployDialogData = new DialogMessageData()

    mounted(): void {
        this.$i18n.locale = "zh-tw"
        this.waitGetAllProjectInfo()
    }

    private async waitGetAllProjectInfo(): Promise<void> {

        if (!store.currentProject) return

        const loadingInstance = this.$loading({ target: document.getElementById("mainSection") ?? "" })

        const response = await Api.getModelInformation(store.currentProject)

        this.inputDeployPath = response.deployPath
        this.deployInfo = response.deployInfo

        if (response.modelList.length === 0) {
            loadingInstance.close()
            this.resultExit = false
            return
        }

        response.modelList.forEach(model => {
            const setting = this.chartSetting(model)
            if (setting) this.charts.push(setting)
            this.acitveResultCollapse.push(model.runId)
        })

        this.$nextTick(() => {

            this.charts.forEach(item => this.renderChart(window.innerWidth, item.data, item.runId))

            loadingInstance.close()

        })



    }

    private chartSetting(taskInfo: ModelInfo): Chart | undefined {

        const modelName = this.$i18n.t(taskInfo.model).toString()

        const process = new Map<string, TrainingProcess>(Object.entries(taskInfo.Train))
        const lineChartData: { epoch: string, accuracy: number }[] = []

        process.forEach(item => {
            lineChartData.push({
                epoch: item.model.epoch.toString(),
                accuracy: item.valid.accuracy,
            })
        })

        // const lastVaild = [...process.values()][process.size - 1].valid

        // console.log("taskinfo",taskInfo.Test.test.test)

        const ringProgressChartData: { scoreName: string, score: number }[] = []

        // for (const [key, value] of Object.entries(lastVaild)) {
        //     ringProgressChartData.push({ scoreName: key, score: value })
        // }

        ringProgressChartData.push({ scoreName: "accuracy", score: taskInfo.Test.test.test.accuracy })

        return {
            data: {
                projectName: taskInfo.projectName,
                date: StringUtil.formatAddSlash(taskInfo.runId),
                datasetPath: taskInfo.datasetPath,
                model: modelName,
                lineChartData,
                ringProgressChartData,
            },
            runId: taskInfo.runId,
            isCurrentVersion: this.isCurrentVersion(taskInfo.runId),
            deployInfoMsg: this.modelDeployInfoMsg(taskInfo.runId),
            deployBtnName: this.deployBtnName(taskInfo.runId),
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

    private getDownloadInfo(runId: string): void {
        this.downloadInfo.runId = runId

        this.dialogMessageData = {
            ...this.dialogMessageData,
            content: [{ inputName: "請輸入下載的檔案名稱", inputContent: "" }],
        }

        this.openDialogMessage = true
    }


    private async downloadModel(content: { inputName: string, inputContent: string }[]): Promise<void> {

        const filename = content.find(item => item.inputName === "請輸入下載的檔案名稱")?.inputContent

        if (!filename || filename === "") return
        if (!storeService.currentProject) return;
        await Api.downloadModel(storeService.currentProject, this.downloadInfo.runId, filename)

        this.openDialogMessage = false
    }

    private editDeployPath(): void {
        this.setDeployPathDialogData = {
            ...this.setDeployPathDialogData,
            content: [{ inputName: "請輸入部署路徑", inputContent: this.inputDeployPath }],
        }

        this.setDeployPathDialog = true
    }

    private async setDeployPath(content: { inputName: string, inputContent: string }[]): Promise<void> {

        const deployPath = content.find(item => item.inputName === "請輸入部署路徑")?.inputContent

        if (!deployPath || deployPath === "") return
        if (!storeService.currentProject) return;
        const deployInfo = await Api.setDeployPath(storeService.currentProject, deployPath);

        if (deployInfo === null) {
            this.inputDeployPath = ""
        } else {
            this.inputDeployPath = deployInfo.deployPath
            this.deployInfo = deployInfo.infoList
        }
        this.setDeployPathDialog = false
    }

    private setDeployFilename(runId: string): void {
        if (this.isCurrentVersion(runId)) return

        this.downloadInfo.runId = runId

        this.deployDialogData = {
            ...this.deployDialogData,
            content: [{ inputName: "請輸入部署檔名", inputContent: "" }],
        }

        this.deployDialog = true
    }

    private async deploy(content: { inputName: string, inputContent: string }[]): Promise<void> {

        const filename = content.find(item => item.inputName === "請輸入部署檔名")?.inputContent

        if (!filename || filename === "") return
        if (!storeService.currentProject) return;
        const deployInfo = await Api.deploy(storeService.currentProject, this.downloadInfo.runId, filename);
        console.log(`this: ${deployInfo}`)

        if (deployInfo !== null) {
            this.deployInfo = deployInfo
            
            this.charts = this.charts.map((chart) => {
                chart.isCurrentVersion = this.isCurrentVersion(chart.runId);
                chart.deployInfoMsg = this.modelDeployInfoMsg(chart.runId);
                chart.deployBtnName = this.deployBtnName(chart.runId);
                return chart
            })
        }
        this.deployDialog = false
    }

    private isCurrentVersion(runId: string): boolean {
        return runId === this.deployInfo[this.deployInfo.length - 1]?.runId ?? '';
    }

    private deployBtnName(runId: string): string {
        if (this.isCurrentVersion(runId)) return "當前版本"
        else return "部署此模型"
    }

    private modelDeployInfoMsg(runId: string): string[] {
        let modelName = ''
        const deployDate: string[] = [];
        for (let i = 0; i < this.deployInfo.length; i++) {
            const info = this.deployInfo[i];
            if (info.runId !== runId) continue

            modelName = info.filename
            if (i === this.deployInfo.length - 1) deployDate.push(`${info.date} ~ now`)
            else deployDate.push(`${info.date} ~ ${this.deployInfo[i + 1].date}`)
        }
        if (deployDate.length === 0) return ['尚未部署過此模型'];
        return [
            `模型名稱： ${modelName}`,
            `部署期間： ${deployDate.join(", ")}`
        ]
    }
}