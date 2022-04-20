import { Component, Vue, Watch } from 'vue-property-decorator';
import { Graph } from "@antv/x6";
import "@antv/x6-vue-shape";
import FlowNode from "@/components/flow-node/FlowNode.vue";
import Api from '@/services/api.service';
import GraphService from "@/services/graph.service";
import FlowNodeSettings from '@/io/flowNodeSettings';
import ProcessCellData from '@/io/processCellData';
import graphData from '@/io/graphData';

import store from '@/services/store.service';
import { Experiment } from '@/io/experiment';
import { Project } from "@/io/project";
import { GetInformationTrainResData, RunTask, TrainingProcess } from "@/io/rest/getInformationTrain";

@Component({
  components: {
    "flow-node": FlowNode,
  }
})

export default class Dashboard extends Vue {

  private projectExist = false;


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

  private trainingInfo = new GetInformationTrainResData;

  private workList: string[] = [];

  private graphs: { data: graphData, percentage: number, runId: string }[] = [];


  @Watch('trainingInfo')
  onTrainingStage(newActive: GetInformationTrainResData): void {

    // console.log("training watch", newActive)

    const taskList = [...newActive.work, ...newActive.done]

    if (taskList.length === 0) return
    if (!this.graphs) return
    if (this.workList.length === 0) return

    const runList = taskList.filter(task => this.workList.includes(task.runId))

    runList.forEach((run) => {
      const graphIndex = this.graphs.findIndex(item => item.runId === run.runId)
      const newRun = this.graphSetting(run)
      if (!this.graphs[graphIndex]) return
      const tmp = this.graphs[graphIndex].percentage
      if (tmp === 100) return

      if (newRun) this.graphs.splice(graphIndex, 1, newRun)

      if ((tmp === 0 && this.graphs[graphIndex].percentage > 0) || this.graphs[graphIndex].percentage === 100) {
        const graphData = this.graphs[graphIndex].data
        graphData.graph?.clearCells()
        graphData.graph = null
        if (!graphData.experiment) return
        graphData.graph = this.drawFlowChart(window.innerWidth, document.getElementById(run.runId), graphData.flowInfo, graphData.experiment, graphData.projectName)
        this.getResultNode()
      }
    })
    

  }
  @Watch('acitveProjectCollapse')
  onCollapse(newActive: string[], oldActive: string[]): void {

    const diffProject = newActive.filter(x => !oldActive.includes(x))[0]
    const repaintGraph = this.graphs.find(x => x.runId === diffProject)

    this.$nextTick(() => {
      if (!repaintGraph) return
      repaintGraph.data.graph?.clearCells()
      repaintGraph.data.graph = null
      if (!repaintGraph.data.experiment) return
      repaintGraph.data.graph = this.drawFlowChart(window.innerWidth, document.getElementById(repaintGraph.runId), repaintGraph.data.flowInfo, repaintGraph.data.experiment, repaintGraph.data.projectName)
      this.getResultNode()
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

  get projectList(): Map<string, Project> {
    return store.projectList
  }

  private async waitGetAllProjectInfo(): Promise<void> {

    const loadingInstance = this.$loading({ target: document.getElementById("mainSection") ?? "" })

    this.trainingInfo = await Api.getInformationTrain()

    if (this.trainingInfo.work.length === 0 && this.trainingInfo.done.length === 0) {
      loadingInstance.close()
      return
    }

    this.projectExist = true

    const projectList = [...store.projectList.keys()]

    for (let i = 0; i < projectList.length; i++) {
      await Api.getExperiments(projectList[i])
      await Api.getDatasets(projectList[i])
    }

    const taskList = [...this.trainingInfo.work, ...this.trainingInfo.done]

    // console.log("tasklist", taskList)

    taskList.forEach(task => {
      const setting = this.graphSetting(task)
      if (setting) this.graphs.push(setting)
    })


    this.acitveProjectCollapse = this.graphs.map(item => item.runId)


    this.$nextTick(() => {
      this.drawGraph();
      // this.getResultNode()
      loadingInstance.close()

      this.workList = this.trainingInfo.work.map(work => work.runId)
      const timeIntervalId = window.setInterval((async () => {
        this.trainingInfo = await Api.getInformationTrain()

        if (this.trainingInfo.work.length === 0) {
          // this.getResultNode()
          window.clearInterval(timeIntervalId)
        }
      }), 5000)

    })

  }
  private graphSetting(taskInfo: RunTask): { data: graphData, percentage: number, runId: string } | undefined {

    const experiment = store.projectList.get(taskInfo.projectName)?.experiments?.get(taskInfo.experimentId)
    if (!experiment) return

    let percentage = 0
    let defaultNodes: FlowNodeSettings[] = []

    if (typeof taskInfo.process !== "string") percentage = this.calculateProgress(new Map<string, TrainingProcess>(Object.entries(taskInfo.process)))

    if (percentage === 0) {
      defaultNodes = GraphService.basicNodes
        .filter(node => node.name !== "model-select-node")
        .filter(node => node.name !== "validation-select-node")
        .filter(node => node.name !== "trained-result-node")
        .filter(node => node.name !== "test-result-node")
    } else if (percentage < 100) {
      defaultNodes = GraphService.basicNodes
        .filter(node => node.name !== "model-select-node-processing")
        .filter(node => node.name !== "validation-select-node")
        .filter(node => node.name !== "trained-result-node")
        .filter(node => node.name !== "test-result-node")
    } else {
      defaultNodes = GraphService.basicNodes.filter(node => !node.name.includes("processing"))
    }


    return {
      data: {
        graph: null,
        flowInfo: defaultNodes,
        projectName: taskInfo.projectName,
        experimentId: taskInfo.experimentId,
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
    this.getResultNode()
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
              stroke: '#1890ff',
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

    return graph
  }

  private progressFormat(percentage: number): string {
    return percentage === 100 ? `已完成` : `${percentage}% 進行中`
  }

  private calculateProgress(process: Map<string, TrainingProcess>): number {

    // const latestKey = [...process.keys()].pop()
    // if (!latestKey) return 0

    const latestInstance = [...process.values()].pop()
    if (!latestInstance) return 0

    const percentage = ((latestInstance.model.epoch / latestInstance.model.total) * 100).toFixed(0)

    return parseInt(percentage)

  }

  private async handleDeleteGraph(graph: { data: graphData, percentage: number, runId: string }): Promise<void> {

    const h = this.$createElement;
    const msg = this.$msgbox({
      type: "warning",
      confirmButtonText: '確定',
      // distinguishCancelAndClose: true,
      showCancelButton: true,
      cancelButtonText: '取消',
      closeOnClickModal: false,
      message: h('h2', { style: 'color:rgb(8, 100, 141)' }, "確定刪除訓練結果?")
    })

    msg.then(async () => {
      const response = await Api.deleteRun(graph.data.projectName, graph.runId)

      if (response === 'success') {
        const graphIndex = this.graphs.findIndex(item => item.runId === graph.runId)

        if (graphIndex > -1) this.graphs.splice(graphIndex, 1)
      }

      if (this.graphs.length === 0) this.projectExist = false
    }).catch(e => console.log(e))

  }

  private setTestResultContent(graph: Graph, accuracy: number): void {

    const nodes = graph.getNodes()
    const testResultNode = nodes.find(node => node.id.includes("validation-select-node"))

    
    const sendContent = {
      component: 'validation-select-node',
      content: [`準確率:${accuracy}`]
    }
    testResultNode?.setData(sendContent, { overwrite: true })
  }

  private getResultNode(): void {
    this.graphs.forEach(graphContent => {
      if (graphContent.percentage === 100) {
        const doneTask = [...this.trainingInfo.done,...this.trainingInfo.work]
        const doneIndex = doneTask.findIndex(task => task.runId = graphContent.runId)
        const process = new Map<string, TrainingProcess>(Object.entries(doneTask[doneIndex].process))
        const lastProcessInstance = [...process.values()].pop()
        if (!lastProcessInstance) return
        if (graphContent.data.graph === null) return
        this.setTestResultContent(graphContent.data.graph, lastProcessInstance.valid.accuracy)
      }
    })
  }

}