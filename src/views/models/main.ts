import { Component, Vue } from 'vue-property-decorator';
import { Line, RingProgress } from '@antv/g2plot';
import ChartService from "@/services/chart.service";
import chartData from '@/io/chartData';
import { TrainingProcess } from '@/io/rest/getQueueInformation';
import Api from '@/services/api.service';
import storeService from '@/services/store.service';
import { StringUtil } from '@/utils/string.util';
import { GetModelInformationResData, ModelInfo } from '@/io/rest/getModelInformation';
import DialogMessage from '@/components/dialogs/dialog-message/DialogMessage.vue';
import DialogMessageData from '@/io/dialogMessageData';
import { DeployInfo } from '@/io/deployInfo';
import DialogTreeList from '@/components/dialogs/dialog-tree-list/DialogTreeList.vue';
import { Experiment } from '@/io/experiment';
import Logger from '@/services/log.service';
import { Message } from 'element-ui';
import { UserInfo } from '@/io/users';



class Chart {
    data!: chartData;
    runId!: string;
    experiment!: Experiment;
    isCurrentVersion = false;
    deployBtnName = '部署此模型';
    deployInfoMsg: string[] = [];
    displayResult = 'train';
}

@Component({
    components: {
        "dialog-message": DialogMessage,
        "dialog-tree-list": DialogTreeList,
    }
})
export default class Models extends Vue {

    get userInfo(): UserInfo {
        return storeService.userInfo
    }

    get projectAuth(): string {
        return storeService.projectList.get(storeService.currentProject ?? '')?.auth ?? ''
    }

    private resultExit = true;
    private inputDeployPath = '';

    private acitveResultCollapse: string[] = [];

    private charts: Chart[] = [];

    private deployInfo: DeployInfo[] = [];

    private openDialogMessage = false;
    private dialogMessageData: DialogMessageData = new DialogMessageData()
    private downloadInfo = { runId: '' }

    private setDeployPathDialog = false;
    private setDeployPathDialogData = { rootPath: 'deploy', title: '設定部署路徑', content: '' };

    private deployDialog = false;
    private deployDialogData = new DialogMessageData()

    private deleteDialog = false
    private deleteGraphInfo = { projectName: '', runId: "" }

    mounted(): void {
        this.$i18n.locale = "zh-tw"
        this.waitGetAllProjectInfo()
    }

    private async waitGetAllProjectInfo(): Promise<void> {

        if (!storeService.currentProject) return

        const loadingInstance = this.$loading({ target: document.getElementById("mainSection") ?? "" })

        const response: GetModelInformationResData = await Api.getModelInformation(storeService.currentProject)

        this.inputDeployPath = response.deployPath
        this.deployInfo = response.deployInfo

        if (response.modelList.length === 0) {
            loadingInstance.close()
            this.resultExit = false
            return
        }

        for (let i = 0; i < response.modelList.length; i++) {
            const setting = await this.chartSetting(response.modelList[i])
            if (setting) this.charts.push(setting)
            this.acitveResultCollapse.push(response.modelList[i].runId)
        }


        this.$nextTick(() => {

            this.charts.forEach(item => this.renderChart(window.innerWidth, item.data, item.runId))

            loadingInstance.close()
        })
    }

    private async chartSetting(taskInfo: ModelInfo): Promise<Chart | undefined> {

        const modelName = this.$i18n.t(taskInfo.model).toString()

        if (!taskInfo.Train) return

        const process = new Map<string, TrainingProcess>(Object.entries(taskInfo.Train))
        const lineChartData: { epoch: string, accuracy: number }[] = []

        process.forEach(item => {
            lineChartData.push({
                epoch: item.model.epoch.toString(),
                accuracy: item.Train.accuracy,
            })
        })


        if (!taskInfo.Test) return

        const ringProgressChartData = { scoreName: "Accuracy", score: taskInfo.Test.Test.Test.accuracy }


        const barChartData: { className: string, classScore: number, classColor: string }[] = []
        const customColor = ['#275776', '#8184D7', '#81D6E6', '#58C6E0', '#6594B4', '#6E71D6', '#43799B', '#8C83F4', '#4282C3', '#08508D']
        // for class accuracy
        for (const [key, value] of Object.entries(taskInfo.Test.Test.Test.classAccuracy)) {
            barChartData.push({ className: key, classScore: Math.round(value * 1000) / 10, classColor: customColor[barChartData.length % customColor.length] })
        }

        const confusionMatrixImagePath = await Api.sendReport(taskInfo.Test.Test.Test.ConfusionMatrix ?? '')

        return {
            data: {
                projectName: taskInfo.projectName,
                date: StringUtil.formatAddSlash(taskInfo.runId),
                datasetPath: taskInfo.datasetPath,
                model: modelName,
                lineChartData,
                ringProgressChartData,
                barChartData,
                confusionMatrixImagePath,
            },
            runId: taskInfo.runId,
            experiment: taskInfo.experiment,
            isCurrentVersion: this.isCurrentVersion(taskInfo.runId),
            deployInfoMsg: this.modelDeployInfoMsg(taskInfo.runId),
            deployBtnName: this.deployBtnName(taskInfo.runId),
            displayResult: 'test',
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

        const ringProgressChartContainer = document.getElementById(`${runId}_ringProgressChart`)
        if (!ringProgressChartContainer) return

        const ringProgressChart = new RingProgress(ringProgressChartContainer, {
            ...ChartService.getRingChartOption(screenWidth, dataContent.ringProgressChartData.score, dataContent.ringProgressChartData.scoreName),
            percent: dataContent.ringProgressChartData.score
        })

        ringProgressChart.render();

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

        this.openDialogMessage = false

        const response = await Api.downloadModel(storeService.currentProject, this.downloadInfo.runId, filename)

        if (typeof response === 'string') {
            Message.error(response)
        } else {
            Message.success('檔案下載中,請稍後')

            const url = window.URL.createObjectURL(new Blob([response], { type: 'application/zip' }))
            const link = document.createElement('a')

            link.href = url
            link.setAttribute('download', `${filename}.zip`)
            link.click()
        }

    }



    private async setDeployPath(deployPath: string): Promise<void> {


        if (!deployPath || deployPath === "") return
        if (!storeService.currentProject) return;
        const deployInfo = await Api.setDeployPath(storeService.currentProject, deployPath);

        if (typeof deployInfo === 'string') {
            this.inputDeployPath = ""
            Message.error(deployInfo)
        } else {
            this.inputDeployPath = deployInfo.deployPath
            this.deployInfo = deployInfo.infoList
            Message.error('設定部署路徑成功')
        }
        this.setDeployPathDialog = false
    }

    private setDeployFilename(runId: string): void {

        if (this.inputDeployPath === '') {
            Message.warning('請先設定部署路徑')
            return
        }

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
        Logger.log(`this: ${deployInfo}`)

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
        if (this.deployInfo === undefined) return false

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

    private handleDropdownDisplay(command: string): void {

        const content = command.split("_")
        const chartId = content[0]
        const displayInfo = content[1]

        const targetChart = this.charts.find(item => item.runId === chartId)
        if (!targetChart) return
        targetChart.displayResult = displayInfo

    }

    private askDeleteRun(runId: string): void {
        if (storeService.currentProject === undefined) return

        this.deleteGraphInfo.projectName = storeService.currentProject
        this.deleteGraphInfo.runId = runId

        this.dialogMessageData = {
            ...this.dialogMessageData,
            type: 'warning',
            title: '確定刪除訓練結果?',
        }

        this.deleteDialog = true
    }

    private async removeRun(): Promise<void> {

        const response = await Api.removeRun(this.deleteGraphInfo.projectName, this.deleteGraphInfo.runId)

        if (response === 'success') {
            const graphIndex = this.charts.findIndex(item => item.runId === this.deleteGraphInfo.runId)

            if (graphIndex > -1) this.charts.splice(graphIndex, 1)
        }

        this.deleteDialog = false
    }

}