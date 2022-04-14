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
import { getInformationTrainResData,trainingProcess } from "@/io/rest/getInformationTrain";

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

  private trainingInfo = new getInformationTrainResData

  private graphs: { data: graphData, percentage: number }[] = [];


  @Watch('trainingInfo')
  onTrainingStage(newActive: getInformationTrainResData, oldActive: getInformationTrainResData): void {

    console.log("trianing watch", newActive.process, "vs", oldActive.process)

    if (typeof newActive.process === "string") return

    // if (newActive) console.log("newactive",newActive.process)
    const latestKey = Object.keys(newActive.process).pop()
    if (!latestKey) return

    const latestInstance:trainingProcess = newActive.process[latestKey]

    const percentage = ((latestInstance.model.epoch/latestInstance.model.total)*100).toFixed(0)
    
    console.log("latest", latestKey, latestInstance)


    this.graphs[0].percentage = parseInt(percentage)
    if(parseInt(percentage) === 100) this.graphs[0].data.flowInfo = GraphService.basicNodes
    this.drawGraph();


  }

  @Watch('acitveProjectCollapse')
  onCollapse(newActive: string[], oldActive: string[]): void {

    const diffProject = newActive.filter(x => !oldActive.includes(x))[0]
    const repaintGraph = this.graphs.find(x => x.data.projectName === diffProject)

    this.$nextTick(() => {
      if (!repaintGraph) return
      repaintGraph.data.graph?.clearCells()
      if (!repaintGraph.data.experiment) return
      repaintGraph.data.graph = this.drawFlowChart(window.innerWidth, document.getElementById(repaintGraph.data.projectName), repaintGraph.data.flowInfo, repaintGraph.data.experiment, repaintGraph.data.projectName)
    })

  }

  created(): void {
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

    if (this.trainingInfo.experimentId === "") {
      loadingInstance.close()
      return
    }


    // await Api.getProjects();
    // if (this.projectList.size === 0) {
    //   // loadingInstance.close()
    //   return
    // }
    this.projectExist = true

    // const projectKeys = [...this.projectList.keys()]
    // this.acitveProjectCollapse = projectKeys
    // for (let index = 0; index < this.projectList.size; index++) {
    //   await Api.getExperiments(projectKeys[index]);
    //   await Api.getDatasets(projectKeys[index]);
    // }

    this.acitveProjectCollapse = [this.trainingInfo.projectName]
    await Api.getExperiments(this.trainingInfo.projectName)
    await Api.getDatasets(this.trainingInfo.projectName)

    this.graphInitSetting(this.trainingInfo.projectName)

    console.log("this.graphs", this.graphs)

    this.$nextTick(async () => {

      const timeIntervalId = window.setInterval((async () => {
        const res = await Api.getInformationTrain()
        if (res.experimentId === "") window.clearInterval(timeIntervalId)
        this.trainingInfo = res
      }), 1000)

      this.drawGraph();

      loadingInstance.close()

    })

  }
  private graphInitSetting(projectName: string): void {

    const experiments = store.projectList.get(projectName)?.experiments
    if (!experiments) return

    const defaultNodes = GraphService.basicNodes
      .filter(node => node.name !== "model-select-node")
      .filter(node => node.name !== "validation-select-node")
      .filter(node => node.name !== "trained-result-node")
      .filter(node => node.name !== "test-result-node")

    experiments.forEach((experiment, experimentId) => {
      this.graphs.push({
        data: {
          graph: null,
          flowInfo: defaultNodes,
          projectName, experimentId, experiment
        },
        percentage: 0,
      })

    })

  }

  // private graphInitSetting(): void {
  //   this.projectList.forEach((project, projectName) => {

  //     if (!project.experiments) return

  //     const defaultNodes = GraphService.basicNodes
  //       .filter(node => node.name !== "model-select-node")
  //       .filter(node => node.name !== "validation-select-node")
  //       .filter(node => node.name !== "trained-result-node")
  //       .filter(node => node.name !== "test-result-node")

  //     project.experiments.forEach((experiment, experimentId) => {
  //       this.graphs.push({
  //         data: {
  //           graph: null,
  //           flowInfo: defaultNodes,
  //           projectName, experimentId, experiment
  //         },
  //         training: false,
  //         percentage: 10,
  //       })

  //     })
  //   })
  // }


  private drawGraph(): void {

    if (this.graphs.length === 0) return

    this.graphs.forEach((item) => {
      item.data.graph?.clearCells()
      if (!item.data.experiment) return
      item.data.graph = this.drawFlowChart(window.innerWidth, document.getElementById(item.data.projectName), item.data.flowInfo, item.data.experiment, item.data.projectName)
    })
  }


  private drawFlowChart(screenWidth: number, container: HTMLElement | null, flow: FlowNodeSettings[], experiment: Experiment, projectName: string): Graph | null {

    if (!container) return null;

    const graph = new Graph(GraphService.getGraphOption(screenWidth, container));

    const cellData: Map<string, ProcessCellData> = ProcessCellData.cellDataContent(experiment, projectName);


    // add default node and edge
    flow.forEach((node: FlowNodeSettings, index: number, array: FlowNodeSettings[]) => {
      const nodeData = cellData.get(node.name);

      graph?.addNode({
        ...GraphService.getNodeSettings(screenWidth, index),
        id: `${node.name}_${projectName}`,
        component: node.name,
        data: nodeData,
      });


      if (0 < index && index < array.length) {
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

}