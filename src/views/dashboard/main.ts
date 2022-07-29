import { Component, Vue, Watch } from 'vue-property-decorator';
import { Graph } from "@antv/x6";
import "@antv/x6-vue-shape";
import { insertCss } from 'insert-css';
import { Message } from 'element-ui';

import Api from '@/services/api.service';
import GraphService from "@/services/graph.service";
import ProcessCellData from '@/io/processCellData';
import graphData from '@/io/graphData';

import { GetQueueInformationResData, RunTask, TestProcess, TrainingProcess } from "@/io/rest/getQueueInformation";
import { StringUtil } from '@/utils/string.util';
import DialogMessage from '@/components/dialogs/dialog-message/DialogMessage.vue';
import DialogMessageData from '@/io/dialogMessageData';


class flowChart {
  runId = '';
  data: graphData = new graphData;
  percentage = 0;
  processingState = '';
}


@Component({
  components: {
    "dialog-message": DialogMessage,
  }
})

export default class Dashboard extends Vue {

  private projectExist = true;

  // search project setting related 

  private searchProjectName = '';

  // collapse related 

  private progressColor = '#ffffff'

  private acitveProjectCollapse: string[] = [];

  private trainingInfo = new GetQueueInformationResData;

  private flowCharts: flowChart[] = [];

  // dialog for delete

  private deleteDialog = false;
  private dialogMessageData: DialogMessageData = new DialogMessageData()
  private deleteGraphInfo = { projectName: '', runId: "" }

  get flowChartList(): flowChart[] | undefined {

    if (this.searchProjectName === '') {
      return this.flowCharts
    }

    return this.flowCharts.filter(item =>
      item.data.projectName.toUpperCase().includes(this.searchProjectName.toUpperCase())
    )
  }

  @Watch('searchProjectName')
  handleSearch(): void {
    this.$nextTick(() => {
      this.drawGraph()
    })
  }


  created(): void {
    this.$i18n.locale = "zh-tw"
    GraphService.registerNodes()
    window.addEventListener("resize", this.drawGraph)
  }

  mounted(): void {
    this.waitGetAllProjectInfo()
  }

  destroy(): void {
    window.removeEventListener("resize", this.drawGraph)
  }


  private async waitGetAllProjectInfo(): Promise<void> {

    const loadingInstance = this.$loading({ target: document.getElementById("mainSection") ?? "" })

    this.trainingInfo = await Api.getQueueInformation()

    const allTasks = [...this.trainingInfo.work, ...this.trainingInfo.done]
      .sort((a, b) => Number(b.runId) - Number(a.runId))

    if (allTasks.length === 0) {
      loadingInstance.close()
      this.projectExist = false
      return
    }

    // get project info
    const projectNameList = [...new Set(allTasks.map(item => item.projectName))]

    for (let i = 0; i < projectNameList.length; i++) {
      await Api.getExperiments(projectNameList[i])
      await Api.getDatasets(projectNameList[i])
    }


    // init flowchart setting
    allTasks.forEach(item => {
      if (item.task === "Test") return
      const flowChart = this.initFlowChart(item)
      this.flowCharts.push(flowChart)
      this.acitveProjectCollapse.push(item.runId)
    })

    this.$nextTick(() => {

      this.drawGraph();

      loadingInstance.close()

      const workingIdList = this.trainingInfo.work.map(task => task.runId)

      const timeIntervalId = window.setInterval((async () => {

        this.trainingInfo = await Api.getQueueInformation()

        const allTasks = [...this.trainingInfo.work, ...this.trainingInfo.done]

        workingIdList.forEach(workingId => {
          const flowChart = this.flowCharts.find(item => item.runId === workingId)
          if (!flowChart) return
          const targetTask = allTasks.filter(task => task.runId === flowChart.runId)
          this.updateFlowChart(flowChart, targetTask)
        })

        const stopCondition = allTasks
          .filter(item => item.task === "Test")
          .map(item => item.process)
          .filter(item => typeof item === "string")
          .filter(item => item !== "This run has been deleted")

        if (stopCondition.length === 0) window.clearInterval(timeIntervalId)

      }), 5000)

    })

  }


  private initFlowChart(taskInfo: RunTask): flowChart {

    const experiment = taskInfo.config
    const cellData: Map<string, ProcessCellData> = ProcessCellData.cellDataContent(experiment, taskInfo.projectName)
    cellData.delete("validation-select-node")

    return {
      runId: taskInfo.runId,
      processingState: '',
      percentage: 0,
      data: {
        graph: null,
        projectName: taskInfo.projectName,
        experimentId: taskInfo.experimentId,
        date: StringUtil.formatAddSlash(taskInfo.runId),
        taskRunning: false,
        experiment,
        cellData,
      }
    }
  }

  private drawGraph(): void {

    if (this.flowCharts.length === 0) return
    this.flowCharts.forEach((item) => {
      item.data.graph?.clearCells()
      item.data.graph = null
      item.data.graph = this.drawFlowChart(window.innerWidth, document.getElementById(item.runId), item)

      const allTasks = [...this.trainingInfo.work, ...this.trainingInfo.done]
      const targetTask = allTasks.filter(task => task.runId === item.runId)
      this.updateFlowChart(item, targetTask)
    })

  }

  private drawFlowChart(screenWidth: number, container: HTMLElement | null, flowChart: flowChart): Graph | null {

    if (!container) return null;
    const graph = new Graph(GraphService.getGraphOption(screenWidth, container));

    const { cellData, projectName, taskRunning } = flowChart.data

    const flow = [...cellData.values()]

    flow.forEach((node: ProcessCellData, index: number, array: ProcessCellData[]) => {

      node.content.forEach((item, index, array) => array[index] = this.$i18n.t(item).toString())

      // add default node
      graph.addNode({
        ...GraphService.getNodeSettings(screenWidth, index),
        id: `${projectName}_${node.component}`,
        component: node.component,
        data: node
      })

      // add default edge
      if (index === 0) return
      graph?.addEdge({
        id: `${projectName}_${array[index - 1].component}_edge`,
        source: { cell: `${projectName}_${array[index - 1].component}`, port: "portRight" },
        target: { cell: `${projectName}_${array[index].component}`, port: "portLeft" },
      });
    })

    return graph
  }


  private updateFlowChart(flowChart: flowChart, targetTask: RunTask[]): void {

    const trainTask = targetTask.find(task => task.task === "Train")
    if (!trainTask) return
    const testTask = targetTask.find(task => task.task === "Test")
    if (!testTask) return

    const trainProcess = trainTask.process
    const testProcess = testTask.process

    if (typeof trainProcess === "string") {
      flowChart.percentage = 0
      flowChart.processingState = trainProcess
      flowChart.data.cellData.forEach(val => val.basic = { ...val.basic, opacity: 0.5 })
      this.updateNodes(flowChart)
    }

    if (typeof trainProcess !== "string") {
      flowChart.percentage = this.calculateProgress(new Map<string, TrainingProcess>(Object.entries(trainProcess)))
      flowChart.processingState = ''
      const processingNode: string[] = []


      if (flowChart.percentage === 0) {
        flowChart.data.taskRunning = true
        processingNode.push('model-select-node', 'trained-result-node', 'test-result-node')
        flowChart.data.cellData.forEach(node => {
          if (processingNode.includes(node.component)) {
            node.basic = { ...node.basic, opacity: 0.5 }
          } else {
            node.basic = { ...node.basic, opacity: 1 }
          }
        })

        this.updateNodes(flowChart)


      } else if (flowChart.percentage < 100) {
        flowChart.data.taskRunning = true
        processingNode.push('trained-result-node', 'test-result-node')
        flowChart.data.cellData.forEach(node => {
          if (processingNode.includes(node.component)) {
            node.basic = { ...node.basic, opacity: 0.5 }
          } else {
            node.basic = { ...node.basic, opacity: 1 }
          }
        })

        this.updateNodes(flowChart)
        this.twinkleNode(flowChart.data.graph, `${flowChart.data.projectName}_model-select-node`, true)

        const animateEdgeList = [`${flowChart.data.projectName}_model-select-node_edge`, `${flowChart.data.projectName}_trained-result-node_edge`]
        animateEdgeList.forEach(edge => this.animateEdge(flowChart.data.graph, edge, true))

      } else {
        flowChart.data.taskRunning = false
        const trainResult = this.getTrainProcessData(new Map<string, TrainingProcess>(Object.entries(trainProcess)))
        const trainResultNode = flowChart.data.cellData.get('trained-result-node')
        if (trainResultNode) trainResultNode.content = [trainResult]
        flowChart.data.cellData.forEach(val => val.basic = { ...val.basic, opacity: 1 })
        this.updateNodes(flowChart)
        this.twinkleNode(flowChart.data.graph, `${flowChart.data.projectName}_model-select-node`, false)
        this.twinkleNode(flowChart.data.graph, `${flowChart.data.projectName}_test-result-node`, true)

        const animateEdgeList = [`${flowChart.data.projectName}_model-select-node_edge`, `${flowChart.data.projectName}_trained-result-node_edge`]
        animateEdgeList.forEach(edge => this.animateEdge(flowChart.data.graph, edge, false))
      }
    }

    if (typeof testProcess !== "string") {
      const testResult = this.getTestProcessData(testProcess as TestProcess)
      const testResultNode = flowChart.data.cellData.get('test-result-node')
      if (testResultNode) testResultNode.content = [testResult]
      this.updateNodes(flowChart)
      this.twinkleNode(flowChart.data.graph, `${flowChart.data.projectName}_test-result-node`, false)
    }

  }

  private updateNodes(flowChart: flowChart): void {

    const graph = flowChart.data.graph
    if (graph === null) return

    const nodes = graph.getNodes()
    flowChart.data.cellData.forEach((data, name) => {
      const nodeName = `${flowChart.data.projectName}_${name}`
      const targetNode = nodes.find(node => node.id === nodeName)
      if (!targetNode) return
      targetNode.setData({ ...data }, { overwrite: true })
    })

  }

  private animateEdge(graph: Graph | null, edgeId: string, animate: boolean): void {

    if (graph === null) return
    const edge = graph.getCellById(edgeId)

    insertCss(`@keyframes ant-line {
      to { stroke-dashoffset: -1000 }
    }`)

    if (animate) {
      edge.setAttrs(
        {
          line: {
            stroke: '#4a9abe',
            strokeDasharray: 5,
            style: {
              animation: 'ant-line 30s infinite linear',
            },
          },
        }
      )
    } else {
      edge.setAttrs(
        {
          line: {
            stroke: '#333',
            strokeDasharray: 0,
            style: {
              animation: ''
            }
          },
        }
      )
    }

  }

  private twinkleNode(graph: Graph | null, nodeId: string, animate: boolean): void {

    if (graph === null) return
    const nodes = graph.getNodes()
    const targetNodeIndex = nodes.findIndex(item => item.id === nodeId)
    if (targetNodeIndex === -1) return

    const twinkleNodeName = `${nodeId}_twinkle`

    if (animate) {
      const modelSelectNodeSetting = GraphService.getNodeSettings(window.innerWidth, targetNodeIndex)
      modelSelectNodeSetting.shape = 'rect'
      graph.addNode({
        ...modelSelectNodeSetting,
        id: twinkleNodeName,
        attrs: {
          body: {
            stroke: '#fff',
          },
        },
      })
      const view = graph.findViewByCell(twinkleNodeName)
      if (view) {
        view.animate('rect', {
          attributeType: 'XML',
          attributeName: 'opacity',
          from: 0.6,
          to: 0.1,
          dur: '2s',
          repeatCount: 'indefinite',
        })
      }
    } else {
      graph.removeCell(twinkleNodeName)
    }


  }

  private progressFormat(percentage: number): string {
    return percentage === 100 ? `訓練已完成` : `${percentage}% 進行中`
  }

  private calculateProgress(process: Map<string, TrainingProcess>): number {

    const latestInstance = [...process.values()].pop()
    if (!latestInstance) return 0

    const percentage = ((latestInstance.model.epoch / latestInstance.model.total) * 100).toFixed(0)

    return parseInt(percentage)

  }

  private getTrainProcessData(process: Map<string, TrainingProcess>): string {

    const lastProcessInstance = [...process.values()].pop()
    if (!lastProcessInstance) return ''

    if (!lastProcessInstance.Train.accuracy) return ''
    return `準確率:${lastProcessInstance.Train.accuracy.toFixed(5)}`
  }

  private getTestProcessData(testData: TestProcess): string {

    return `準確率:${testData.Test.Test.accuracy.toFixed(5)}`
  }

  private askDeleteRun(projectName: string, runId: string): void {

    this.deleteGraphInfo.projectName = projectName
    this.deleteGraphInfo.runId = runId

    this.dialogMessageData = {
      ...this.dialogMessageData,
      type: 'warning',
      title: '確定刪除訓練結果?',
    }

    this.deleteDialog = true
  }

  private async removeRunInQueue(): Promise<void> {

    const response = await Api.removeRunInQueue(this.deleteGraphInfo.projectName, this.deleteGraphInfo.runId)

    if (response === 'success') {
      this.flowCharts = this.flowCharts.filter(item => item.runId !== this.deleteGraphInfo.runId)

      this.trainingInfo = await Api.getQueueInformation()
      this.drawGraph()
      Message.success('訓練結果刪除成功')
    } else {
      Message.error(response)
    }

    if (this.flowCharts.length === 0) this.projectExist = false

    this.deleteDialog = false
  }

  private async handleToModelsPage(graph: { data: graphData, percentage: number, runId: string }): Promise<void> {
    this.$router.push(`${graph.data.projectName}/models`)
  }

}