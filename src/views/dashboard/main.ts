import { Component, Vue } from 'vue-property-decorator';
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
import DialogMessage from '@/components/dialog-message/DialogMessage.vue';
import DialogMessageData from '@/io/dialogMessageData';


@Component({
  components: {
    "flow-node": FlowNode,
    "dialog-message": DialogMessage,
  }
})

export default class Dashboard extends Vue {

  private projectExist = true;

  // search project setting related 
  private selectedDatasetValue = "";
  private datasetOptions: Array<{ value: string, label: string }> = [
    {
      value: "all data",
      label: "所有資料集",
    },
    {
      value: "dataset 001",
      label: "001 dataset",
    },
    {
      value: "dataset 002",
      label: "002 dataset",
    },
  ]
  private inputModelName = "";

  // collapse related 

  private progressColor = '#ffffff'

  private acitveProjectCollapse: string[] = [];

  private trainingInfo = new GetQueueInformationResData;

  private graphs: { runId: string, data: graphData, percentage: number }[] = [];

  // dialog for delete

  private openDialogMessage = false;
  private dialogMessageData: DialogMessageData = new DialogMessageData()
  private deleteGraphInfo = { projectName: '', runId: "" }


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


    // get all project info
    const projectList = [...store.projectList.keys()]

    for (let i = 0; i < projectList.length; i++) {
      await Api.getExperiments(projectList[i])
      await Api.getDatasets(projectList[i])
    }

    // get initial graphs setting

    const allTrainTask = [...this.trainingInfo.work, ...this.trainingInfo.done]
      .filter(task => task.task !== "Test")

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

        workingIdList.forEach(workingId => {

          const targetGraphIndex = this.graphs.findIndex(item => item.runId === workingId)

          const workingIdTask = [...this.trainingInfo.work, ...this.trainingInfo.done].filter(task => task.runId === workingId)

          // train task
          const workingIdTaskTrain = workingIdTask.find(task => task.task === "Train")
          // test task
          const workingIdTaskTest = workingIdTask.find(task => task.task === "Test")

          let gate = false

          if (workingIdTaskTrain) gate = this.handleTrainTask(workingIdTaskTrain, targetGraphIndex)

          if (workingIdTaskTest && gate === true) this.handleTestTask(workingIdTaskTest, targetGraphIndex)

        })

        if (this.trainingInfo.work.length === 0) window.clearInterval(timeIntervalId)

      }), 5000)



    })

  }
  private graphSetting(taskInfo: RunTask): { data: graphData, percentage: number, runId: string } | undefined {

    const experiment = store.projectList.get(taskInfo.projectName)?.experiments?.get(taskInfo.experimentId)
    if (!experiment) return


    let percentage = 0
    let defaultNodes: FlowNodeSettings[] = []

    if (typeof taskInfo.process !== "string") {
      percentage = this.calculateProgress(new Map<string, TrainingProcess>(Object.entries(taskInfo.process)))
    }

    if (percentage === 0) {
      defaultNodes = GraphService.basicNodes
        .filter(node => !node.name.includes("validation-select"))
        .filter(node => node.name !== "model-select-node")
        .filter(node => node.name !== "trained-result-node")
        .filter(node => node.name !== "test-result-node")
    } else if (percentage < 100) {
      defaultNodes = GraphService.basicNodes
        .filter(node => !node.name.includes("validation-select"))
        .filter(node => node.name !== "model-select-node-processing")
        .filter(node => node.name !== "trained-result-node")
        .filter(node => node.name !== "test-result-node")
    } else {
      defaultNodes = GraphService.basicNodes
        .filter(node => !node.name.includes("validation-select"))
        .filter(node => !node.name.includes("processing"))
    }

    return {
      data: {
        graph: null,
        flowInfo: defaultNodes,
        projectName: taskInfo.projectName,
        experimentId: taskInfo.experimentId,
        date: StringUtil.formatAddSlash(taskInfo.runId),
        experiment: experiment
      },
      percentage: percentage,
      runId: taskInfo.runId
    }

  }

  private drawGraph(): void {

    if (this.graphs.length === 0) return

    this.graphs.forEach((item) => {
      item.data.graph?.clearCells()
      item.data.graph = null
      if (!item.data.experiment) return
      item.data.graph = this.drawFlowChart(window.innerWidth, document.getElementById(item.runId), item.data.flowInfo, item.data.experiment, item.data.projectName)
    })
    this.setResultNodesContent()
  }


  private drawFlowChart(screenWidth: number, container: HTMLElement | null, flow: FlowNodeSettings[], experiment: Experiment, projectName: string): Graph | null {

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

      if (index > 0 && array[index].name.includes("processing")) {
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

    if (conditionA > 0 && conditionB > 0) {
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



  private async handleToModelsPage(graph: { data: graphData, percentage: number, runId: string }): Promise<void> {

    this.$router.push(`${graph.data.projectName}/models`)

  }

  private setTrainResultContent(graph: Graph, accuracy: number): void {

    const nodes = graph.getNodes()
    const testResultNode = nodes.find(node => node.id.includes("trained-result-node"))
    const sendContent = {
      component: "trained-result-node",
      content: [`準確率:${accuracy}`]
    }
    testResultNode?.setData(sendContent, { overwrite: true })
  }

  private setTestResultContent(graph: Graph, accuracy: number): void {

    const nodes = graph.getNodes()
    const testResultNode = nodes.find(node => node.id.includes("test-result-node"))
    const sendContent = {
      component: "test-result-node",
      content: [`準確率:${accuracy}`]
    }
    testResultNode?.setData(sendContent, { overwrite: true })
  }


  private setResultNodesContent(): void {

    const trainTask = [...this.trainingInfo.done, ...this.trainingInfo.work].filter(task => task.task === "Train")
    const testTask = [...this.trainingInfo.done, ...this.trainingInfo.work].filter(task => task.task === "Test")

    this.graphs.forEach(graphContent => {

      if (graphContent.percentage !== 100) return
      const trainIndex = trainTask.findIndex(task => task.runId === graphContent.runId)
      const process = new Map<string, TrainingProcess>(Object.entries(trainTask[trainIndex].process))

      const lastProcessInstance = [...process.values()].pop()
      if (!lastProcessInstance) return
      if (graphContent.data.graph === null) return
      this.setTrainResultContent(graphContent.data.graph, lastProcessInstance.valid.accuracy)
    })

    this.graphs.forEach(graphContent => {
      if (graphContent.percentage !== 100) return

      const testIndex = testTask.findIndex(task => task.runId === graphContent.runId)
      const process = new TestProcess()

      if (typeof testTask[testIndex].process === "string") return
      process.test = [...Object.values(testTask[testIndex].process)][0]

      if (graphContent.data.graph === null) return
      this.setTestResultContent(graphContent.data.graph, process.test.test.accuracy)

    })

  }

  private updateSingleGraph(graph: { data: graphData, percentage: number, runId: string }): void {
    const graphData = graph.data
    graphData.graph?.clearCells()
    graphData.graph = null
    if (!graphData.experiment) return
    graphData.graph = this.drawFlowChart(window.innerWidth, document.getElementById(graph.runId), graphData.flowInfo, graphData.experiment, graphData.projectName)

  }

  private handleTrainTask(trainTask: RunTask, targetGraphIndex: number): boolean {

    const originPercentage = this.graphs[targetGraphIndex].percentage
    if (originPercentage === 100) return true

    const newGraphSetting = this.graphSetting(trainTask)
    if (!newGraphSetting) return false

    // update graph setting
    this.graphs.splice(targetGraphIndex, 1, newGraphSetting)

    const updatedPercentage = this.graphs[targetGraphIndex].percentage

    if ((originPercentage === 0 && updatedPercentage > 0) || updatedPercentage === 100) {
      this.updateSingleGraph(this.graphs[targetGraphIndex])
    }

    if (updatedPercentage === 100) {
      const process = new Map<string, TrainingProcess>(Object.entries(trainTask.process))
      const lastProcessInstance = [...process.values()].pop()
      if (!lastProcessInstance) return false
      const graph = this.graphs[targetGraphIndex].data.graph
      if (graph === null) return false
      this.setTrainResultContent(graph, lastProcessInstance.valid.accuracy)
    }

    return false
  }

  private handleTestTask(testTask: RunTask, targetGraphIndex: number): void {

    this.updateSingleGraph(this.graphs[targetGraphIndex])

    const graph = this.graphs[targetGraphIndex].data.graph
    if (graph === null) return

    const nodes = graph.getNodes()
    const testResultNode = nodes.findIndex(node => node.id.includes("test-result-node"))
    const twinkle_node = nodes.find(node => node.id === "twinkle_node")


    if (typeof testTask.process === "string") {

      if (!twinkle_node) this.addTwinkleAnimateNode(graph, window.innerWidth, testResultNode)
      return
    }

    if (twinkle_node) graph.removeCell("twinkle_node")

    const process = new TestProcess()
    process.test = [...Object.values(testTask.process)][0]


    this.setTestResultContent(graph, process.test.test.accuracy)

  }

  private askDeleteRun(projectName: string, runId: string): void {

    this.deleteGraphInfo.projectName = projectName
    this.deleteGraphInfo.runId = runId

    this.dialogMessageData = {
      ...this.dialogMessageData,
      type: 'warning',
      title: '確定刪除訓練結果?',
    }

    this.openDialogMessage = true
  }

  private async removeRunInQueue(): Promise<void> {

    const response = await Api.removeRunInQueue(this.deleteGraphInfo.projectName, this.deleteGraphInfo.runId)

    if (response === 'success') {
      const graphIndex = this.graphs.findIndex(item => item.runId === this.deleteGraphInfo.runId)

      if (graphIndex > -1) this.graphs.splice(graphIndex, 1)
    }

    if (this.graphs.length === 0) this.projectExist = false

    this.openDialogMessage = false
  }



}