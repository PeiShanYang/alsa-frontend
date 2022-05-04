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
import { GetInformationTrainResData, RunTask, TestProcess, TrainingProcess } from "@/io/rest/getInformationTrain";
import { StringUtil } from '@/utils/string.util';

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

  private workingTask: RunTask[] = [];
  private doneTask: RunTask[] = [];

  private workList: string[] = [];

  private graphs: { runId: string, data: graphData, percentage: number }[] = [];


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
      this.setResultNodesContent()
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

    this.trainingInfo = await Api.getInformationTrain()

    if (this.trainingInfo.work.length === 0 && this.trainingInfo.done.length === 0) {
      loadingInstance.close()
      return
    }

    this.projectExist = true


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


      // for (let i = 0; i < workingIdList.length; i++) {

      //   const timeIntervalSetting = window.setInterval((async () => {

      //     this.trainingInfo = await Api.getInformationTrain()

      //     const workId = workingIdList[i]
      //     const graphIndex = this.graphs.findIndex(graphData => graphData.runId === workId)


      //     // RunTask on work
      //     const workTaskArr = [...this.trainingInfo.work]
      //       .filter(task => task.runId !== workId)
      //       .filter(task => task.task !== "Test")

      //     if (workTaskArr.length === 1) {

      //       const workTask = workTaskArr[0]
      //       const newGraph = this.graphSetting(workTask)
      //       if (!newGraph) return
      //       if (newGraph.percentage === 0) return

      //       const oldGraphPercentage = this.graphs[graphIndex].percentage

      //       // update graph content
      //       this.graphs.splice(graphIndex, 1, newGraph)

      //       if (oldGraphPercentage !== 0) return
      //       this.updateSingleGraph(this.graphs[graphIndex])
      //     }

      //     // RunTask on done with train task
      //     const doneTaskTrainArr = [...this.trainingInfo.done]
      //       .filter(task => task.task !== "Test")

      //     if (doneTaskTrainArr.length === 1) {

      //       const doneTaskTrain = doneTaskTrainArr[0]
      //       const newGraph = this.graphSetting(doneTaskTrain)
      //       if (!newGraph) return

      //       // update graph content
      //       this.graphs.splice(graphIndex, 1, newGraph)

      //       this.updateSingleGraph(this.graphs[graphIndex])

      //       const process = new Map<string, TrainingProcess>(Object.entries(doneTaskTrain.process))
      //       const lastProcessInstance = [...process.values()].pop()
      //       if (!lastProcessInstance) return
      //       const graph = this.graphs[graphIndex].data.graph
      //       if (graph === null) return
      //       this.setTrainResultContent(graph, lastProcessInstance.valid.accuracy)
      //     }

      //     // RunTask on done with test task
      //     const doneTaskTestArr = [...this.trainingInfo.done]
      //       .filter(task => task.task !== "Train")

      //     if(doneTaskTestArr.length === 1){

      //       const doneTaskTest = doneTaskTestArr[0]
      //       const process = new TestProcess()
      //       process.test = [...Object.values(doneTaskTest.process)][0]
      //       const graph = this.graphs[graphIndex].data.graph
      //       if (graph === null) return
      //       this.setTestResultContent(graph, process.test.test.accuracy)

      //       window.clearInterval(timeIntervalSetting)
      //     }
      //   }), 5000)

      // }


      const timeIntervalId = window.setInterval((async () => {


        this.trainingInfo = await Api.getInformationTrain()

        // RunTask on work
        const workTaskList = [...this.trainingInfo.work].filter(task => task.task !== "Test")

        workTaskList.forEach(workTask => {

          const newGraph = this.graphSetting(workTask)

          if (!newGraph) return
          if (newGraph.percentage === 0) return

          const graphIndex = this.graphs.findIndex(item => item.runId === workTask.runId)

          const oldGraphPercentage = this.graphs[graphIndex].percentage

          this.graphs.splice(graphIndex, 1, newGraph)

          if (oldGraphPercentage !== 0) return

          this.updateSingleGraph(this.graphs[graphIndex])

        })

        // RunTask on done
        const doneTaskList = [...this.trainingInfo.done].filter(task => workingIdList.includes(task.runId))

        const doneTaskListTrain = doneTaskList.filter(task => task.task !== "Test")

        doneTaskListTrain.forEach(doneTask => {

          const newGraph = this.graphSetting(doneTask)

          if (!newGraph) return

          const graphIndex = this.graphs.findIndex(item => item.runId === doneTask.runId)

          const oldGraphPercentage = this.graphs[graphIndex].percentage

          // if (oldGraphPercentage === newGraph.percentage) return

          this.graphs.splice(graphIndex, 1, newGraph)

          this.updateSingleGraph(this.graphs[graphIndex])

          const process = new Map<string, TrainingProcess>(Object.entries(doneTask.process))
          const lastProcessInstance = [...process.values()].pop()
          if (!lastProcessInstance) return
          const graph = this.graphs[graphIndex].data.graph
          if (graph === null) return
          this.setTrainResultContent(graph, lastProcessInstance.valid.accuracy)
        })

        const doneTaskListTest = doneTaskList.filter(task => task.task !== "Train")

        doneTaskListTest.forEach(doneTask => {
          const graphIndex = this.graphs.findIndex(item => item.runId === doneTask.runId)

          const process = new TestProcess()
          process.test = [...Object.values(doneTask.process)][0]
          const graph = this.graphs[graphIndex].data.graph
          if (graph === null) return
          this.setTestResultContent(graph, process.test.test.accuracy)
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
        .filter(node => node.name !== "model-select-node")
        .filter(node => node.name !== "validation-select-node")
        .filter(node => node.name !== "trained-result-node")
        .filter(node => node.name !== "test-result-node")
        .filter(node => node.name !== "validation-select-node-processing")
    } else if (percentage < 100) {
      defaultNodes = GraphService.basicNodes
        .filter(node => node.name !== "model-select-node-processing")
        .filter(node => node.name !== "validation-select-node")
        .filter(node => node.name !== "trained-result-node")
        .filter(node => node.name !== "test-result-node")
        .filter(node => node.name !== "validation-select-node-processing")
    } else {
      defaultNodes = GraphService.basicNodes
        .filter(node => !node.name.includes("processing"))
        .filter(node => !node.name.includes("validation-select-node"))
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


    const conditionA = flow.filter(item => item.name.includes("processing")).length
    const conditionB = flow.filter(item => item.name === "model-select-node").length

    if (conditionA > 0 && conditionB > 0) {
      const modelSelectNodeIndex = flow.findIndex(item => item.name.includes("model-select-node"))
      const modelSelectNodeSetting = GraphService.getNodeSettings(screenWidth, modelSelectNodeIndex)
      modelSelectNodeSetting.shape = 'rect'

      const rect = graph.addNode({
        ...modelSelectNodeSetting,
        attrs: {
          body: {
            stroke: '#8282DD',
          },
        },
      })

      const view = graph.findView(rect)

      if (view) {
        view.animate('rect', {
          attributeType: 'XML',
          attributeName: 'opacity',
          from: 0.6,
          to: 0.1,
          dur: '0.8s',
          repeatCount: 'indefinite',
        })
      }

    }

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

  private async handeToModelsPage(graph: { data: graphData, percentage: number, runId: string }): Promise<void> {

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

}