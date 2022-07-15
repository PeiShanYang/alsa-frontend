import { Component, Vue, Watch } from 'vue-property-decorator';
import { Graph } from "@antv/x6";
import "@antv/x6-vue-shape";
import { insertCss } from 'insert-css';

import FlowNode from "@/components/flow-node/FlowNode.vue";
import Api from '@/services/api.service';
import GraphService from "@/services/graph.service";
import FlowNodeSettings from '@/io/flowNodeSettings';
import ProcessCellData from '@/io/processCellData';
import graphData from '@/io/graphData';

import store from '@/services/store.service';
import { Experiment } from '@/io/experiment';
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
    "flow-node": FlowNode,
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

  private graphs: flowChart[] = [];

  private runFailList: string[] = []

  

  // dialog for delete

  private deleteDialog = false;
  private dialogMessageData: DialogMessageData = new DialogMessageData()
  private deleteGraphInfo = { projectName: '', runId: "" }

  get graphList(): flowChart[] | undefined {

    if (this.searchProjectName === '') {
      return this.graphs
    }

    return this.graphs.filter(item =>
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

    if (this.trainingInfo.work.length === 0 && this.trainingInfo.done.length === 0) {
      loadingInstance.close()
      this.projectExist = false
      return
    }

    //get all train task
    const allTrainTask = [...this.trainingInfo.work, ...this.trainingInfo.done]
      .filter(item => item.task !== "Test")
      .sort((a,b)=> Number(b.runId) - Number(a.runId))

    // get project info
    const projectNameList = [...new Set(allTrainTask.map(item => item.projectName))]

    for (let i = 0; i < projectNameList.length; i++) {
      await Api.getExperiments(projectNameList[i])
      await Api.getDatasets(projectNameList[i])
    }

    // initial graphs setting

    allTrainTask.forEach(task => {
      const setting = this.graphSetting(task)
      if (setting) this.graphs.push(setting)
    })


    this.acitveProjectCollapse = this.graphs.map(item => item.runId)


    this.$nextTick(() => {

      this.drawGraph();

      loadingInstance.close()

      const workingIdList = this.trainingInfo.work.map(task => task.runId)

      const timeIntervalId = window.setInterval((async () => {

        this.trainingInfo = await Api.getQueueInformation()

        const allTask = [...this.trainingInfo.work, ...this.trainingInfo.done]

        workingIdList.forEach(workingId => {

          const targetGraphIndex = this.graphs.findIndex(item => item.runId === workingId)

          const workingIdTask = allTask.filter(task => task.runId === workingId)

          // train task
          const workingIdTaskTrain = workingIdTask.find(task => task.task === "Train")
          // test task
          const workingIdTaskTest = workingIdTask.find(task => task.task === "Test")

          let gate = false

          if (workingIdTaskTrain) gate = this.handleTrainTask(workingIdTaskTrain, targetGraphIndex)

          if (workingIdTaskTest && gate === true) this.handleTestTask(workingIdTaskTest, targetGraphIndex)

        })

        const stopCondition = allTask
          .map(item => item.process)
          .filter(item => typeof item === "string")
          .filter(item => item !== "This run has been deleted")

        if (stopCondition.length === 0) window.clearInterval(timeIntervalId)

      }), 5000)

    })

  }


  private graphSetting(taskInfo: RunTask): flowChart | undefined {

    const experiment = taskInfo.config

    let processingState = ''
    let taskRunning = false
    let percentage = 0
    let defaultNodes: FlowNodeSettings[] = GraphService.basicNodes.filter(node => !node.name.includes("validation-select"))

    if (typeof taskInfo.process === "string") {

      processingState = taskInfo.process
      defaultNodes = defaultNodes.filter(node => node.name.includes("processing"))

    } else {

      // processingState = "Task is running"
      taskRunning = true
      percentage = this.calculateProgress(new Map<string, TrainingProcess>(Object.entries(taskInfo.process))) ?? 0

      if (percentage === 0) {
        const nodes = ['dataset-node', 'preprocess-node', 'augmentation-node', 'model-select-node-processing', 'trained-result-node-processing', 'test-result-node-processing']
        defaultNodes = defaultNodes.filter(node => nodes.includes(node.name))
      } else if (percentage < 100) {
        const nodes = ['dataset-node', 'preprocess-node', 'augmentation-node', 'model-select-node', 'trained-result-node-processing', 'test-result-node-processing']
        defaultNodes = defaultNodes.filter(node => nodes.includes(node.name))
      } else {
        defaultNodes = defaultNodes.filter(node => !node.name.includes("processing"))
        // processingState = "Task finished"
      }

    }

    return {
      data: {
        graph: null,
        flowInfo: defaultNodes,
        projectName: taskInfo.projectName,
        experimentId: taskInfo.experimentId,
        date: StringUtil.formatAddSlash(taskInfo.runId),
        experiment: experiment,
        taskRunning,
      },
      percentage: percentage,
      runId: taskInfo.runId,
      processingState,
    }

  }

  private drawGraph(): void {

    if (this.graphs.length === 0) return

    this.graphs.forEach((item) => {
      item.data.graph?.clearCells()
      item.data.graph = null
      if (!item.data.experiment) return
      item.data.graph = this.drawFlowChart(window.innerWidth, document.getElementById(item.runId), item.data.flowInfo, item.data.experiment, item.data.projectName, item.data.taskRunning)

      if (!item.data.graph) return
      this.nodeContentSetting(item.data.graph, item.runId, this.trainingInfo)
    })

  }


  private drawFlowChart(screenWidth: number, container: HTMLElement | null, flow: FlowNodeSettings[], experiment: Experiment, projectName: string, taskRunning: boolean): Graph | null {

    if (!container) return null;

    const graph = new Graph(GraphService.getGraphOption(screenWidth, container));

    const cellData: Map<string, ProcessCellData> = ProcessCellData.cellDataContent(experiment, projectName);

    // add default node and edge
    flow.forEach((node: FlowNodeSettings, index: number, array: FlowNodeSettings[]) => {

      const nodeData = cellData.get(node.name);

      if (!nodeData?.content) return

      nodeData.content.forEach((item, index, array) => array[index] = this.$i18n.t(item).toString())

      graph?.addNode({
        ...GraphService.getNodeSettings(screenWidth, index),
        id: `${node.name}_${projectName}`,
        component: node.name,
        data: nodeData,
      });

      if (index === 0) return

      if (index > 0 && array[index].name.includes("processing") && taskRunning) {
        graph?.addEdge({
          source: { cell: `${array[index - 1].name}_${projectName}`, port: "portRight" },
          target: { cell: `${array[index].name}_${projectName}`, port: "portLeft" },
          attrs: {
            line: {
              stroke: '#4a9abe',
              strokeDasharray: 5,
              targetMarker: 'classic',
              className: 'ant-line',
              style: {
                animation: 'ant-line 30s infinite linear',
              },
            },
          },
        });
      } else {
        graph?.addEdge({
          source: { cell: `${array[index - 1].name}_${projectName}`, port: "portRight" },
          target: { cell: `${array[index].name}_${projectName}`, port: "portLeft" },
        });
      }

    });

    insertCss(`@keyframes ant-line {
      to { stroke-dashoffset: -1000 }
    }`)


    const conditionA = flow.filter(item => item.name.includes("processing")).length
    const conditionB = flow.filter(item => item.name === "model-select-node").length

    if (conditionA > 0 && conditionB > 0 && taskRunning) {
      const modelSelectNodeIndex = flow.findIndex(item => item.name.includes("model-select-node"))
      this.addTwinkleAnimateNode(graph, screenWidth, modelSelectNodeIndex)
    }

    return graph
  }

  private addTwinkleAnimateNode(graph: Graph, screenWidth: number, nodeIndex: number): void {

    const modelSelectNodeSetting = GraphService.getNodeSettings(screenWidth, nodeIndex)
    modelSelectNodeSetting.shape = 'rect'

    graph.addNode({
      ...modelSelectNodeSetting,
      id: "twinkle_node",
      attrs: {
        body: {
          stroke: '#fff',
        },
      },
    })

    const view = graph.findViewByCell("twinkle_node")

    if (view) {
      view.animate('rect', {
        attributeType: 'XML',
        attributeName: 'opacity',
        from: 0.6,
        to: 0.1,
        dur: '1.0s',
        repeatCount: 'indefinite',
      })
    }
  }

  private progressFormat(percentage: number): string {
    return percentage === 100 ? `訓練已完成` : `${percentage}% 進行中`
  }

  private calculateProgress(process: Map<string, TrainingProcess>): number {

    // const latestKey = [...process.keys()].pop()
    // if (!latestKey) return 0

    const latestInstance = [...process.values()].pop()
    if (!latestInstance) return 0

    const percentage = ((latestInstance.model.epoch / latestInstance.model.total) * 100).toFixed(0)

    return parseInt(percentage)

  }


  private setNodeContent(graph: Graph, nodeName: string, nodeContent: string): void {

    const nodes = graph.getNodes()
    const targetNode = nodes.find(node => node.id.includes(nodeName))
    const sendContent = {
      component: nodeName,
      content: [nodeContent],
    }
    if (!targetNode) return
    targetNode.setData(sendContent, { overwrite: true })

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


  private nodeContentSetting(graph: Graph, graphRunId: string, taskInfo: GetQueueInformationResData): void {

    const trainTask = taskInfo.done.filter(item => item.task === "Train")
    const trainIndex = trainTask.findIndex(item => item.runId === graphRunId)
    if (trainIndex === -1) return

    if (typeof trainTask[trainIndex].process === 'string') return
    const trainContent = this.getTrainProcessData(new Map<string, TrainingProcess>(Object.entries(trainTask[trainIndex].process)))
    if (trainContent === '') return

    this.setNodeContent(graph, 'trained-result-node', trainContent)

    const testTask = taskInfo.done.filter(item => item.task === "Test")
    const testIndex = testTask.findIndex(item => item.runId === graphRunId)
    if (testIndex === -1) return

    if (typeof testTask[testIndex].process === 'string') return
    const testContent = this.getTestProcessData(testTask[testIndex].process as TestProcess)

    this.setNodeContent(graph, 'test-result-node', testContent)

  }

  private updateSingleGraph(graph: flowChart): void {
    const graphData = graph.data
    graphData.graph?.clearCells()
    graphData.graph = null
    if (!graphData.experiment) return
    graphData.graph = this.drawFlowChart(window.innerWidth, document.getElementById(graph.runId), graphData.flowInfo, graphData.experiment, graphData.projectName, graphData.taskRunning)

  }

  private handleTrainTask(trainTask: RunTask, targetGraphIndex: number): boolean {


    if (this.graphs.length === 0) return false

    if (!this.graphs[targetGraphIndex]) return false
    const originPercentage = this.graphs[targetGraphIndex].percentage

    const newGraphSetting = this.graphSetting(trainTask)
    if (!newGraphSetting) return false

    const updatedPercentage = newGraphSetting.percentage

    // update graph percentage 
    this.graphs[targetGraphIndex].percentage = updatedPercentage
    this.graphs[targetGraphIndex].processingState = newGraphSetting.processingState


    if ((originPercentage === 0 && updatedPercentage > 0) || originPercentage !== 100 && updatedPercentage === 100) {

      this.updateSingleGraph(newGraphSetting)

      this.graphs.splice(targetGraphIndex, 1, newGraphSetting)

    }

    if (updatedPercentage !== 100) return false

    const nodeContent = this.getTrainProcessData(new Map<string, TrainingProcess>(Object.entries(trainTask.process)))
    if (nodeContent === '') return false

    const graph = this.graphs[targetGraphIndex].data.graph
    if (graph === null) return false

    this.setNodeContent(graph, 'trained-result-node', nodeContent)

    return true
  }

  private handleTestTask(testTask: RunTask, targetGraphIndex: number): void {

    const graph = this.graphs[targetGraphIndex].data.graph
    if (graph === null) return

    const nodes = graph.getNodes()
    const testResultNodeIndex = nodes.findIndex(node => node.id.includes("test-result-node"))
    const twinkleNode = nodes.find(node => node.id.includes("twinkle_node"))

    if (typeof testTask.process === "string") {

      // this.graphs[targetGraphIndex].processingState = "Testing"
      if (!twinkleNode) this.addTwinkleAnimateNode(graph, window.innerWidth, testResultNodeIndex)
      return
    }

    // this.graphs[targetGraphIndex].processingState = "Task finished"
    graph.removeCell("twinkle_node")
    const testContent = this.getTestProcessData(testTask.process as TestProcess)
    this.setNodeContent(graph, 'test-result-node', testContent)

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
      this.graphs = this.graphs.filter(item => item.runId !== this.deleteGraphInfo.runId)
      this.drawGraph()
    }

    if (this.graphs.length === 0) this.projectExist = false

    this.deleteDialog = false
  }

  private async handleToModelsPage(graph: { data: graphData, percentage: number, runId: string }): Promise<void> {
    this.$router.push(`${graph.data.projectName}/models`)
  }

}