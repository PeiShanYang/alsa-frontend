import { Component, Vue } from 'vue-property-decorator';
import { Graph } from "@antv/x6";
import "@antv/x6-vue-shape";
import DialogDataset from '@/components/dialog-dataset/DialogDataset.vue';
import DialogPreprocess from '@/components/dialog-preprocess/DialogPreprocess.vue';
import DialogModelSelect from '@/components/dialog-model-select/DialogModelSelect.vue';
import FlowNode from "@/components/flow-node/FlowNode.vue";
import Api from '@/services/api.service';
import GraphService from "@/services/graph.service";
import FlowNodeSettings from '@/io/flowNodeSettings';
import ProcessCellData from '@/io/processCellData';

import store from '@/services/store.service';
import { Experiment } from '@/io/experiment';
import { DatasetStatus } from '@/io/dataset';
import graphData from '@/io/graphData';

import { Line } from '@antv/g2plot';

@Component({
  components: {
    "dialog-dataset": DialogDataset,
    "dialog-preprocess": DialogPreprocess,
    "dialog-model-select": DialogModelSelect,
    "flow-node": FlowNode,
  }
})
export default class Experiments extends Vue {

  private data = [
    { epoch: '1', accuracy: 0.2 },
    { epoch: '2', accuracy: 0.2 },
    { epoch: '3', accuracy: 0.4 },
    { epoch: '4', accuracy: 0.75 },
    { epoch: '5', accuracy: 0.75 },
    { epoch: '6', accuracy: 0.75 },
    { epoch: '7', accuracy: 0.85 },
    { epoch: '8', accuracy: 0.85 },
    { epoch: '9', accuracy: 0.9 },
    { epoch: '10', accuracy: 0.9 },
  ];

  private acitveProjectCollapse: string[] = ["1"];
  private openDialogRunProject = false;
  private openDialogDataset = false;
  private openDialogPreprocess = false;
  private openDialogModelSelect = false;

  private datasets: Map<string, DatasetStatus> | undefined = new Map<string, DatasetStatus>();

  private graph = new graphData;

  created(): void {
    this.$i18n.locale = "zh-tw"
    GraphService.registerNodes()
    window.addEventListener("resize", this.drawGraph)
  }

  mounted(): void {
    this.waitGetExperiments();
  }

  destroy(): void {
    window.removeEventListener("resize", this.drawGraph)
  }

  get projectName(): string {
    return this.$route.params.projectName
  }

  private async waitGetExperiments(): Promise<void> {

    if (!store.currentProject) return

    this.graph.projectName = store.currentProject

    await Api.getExperiments(store.currentProject);
    await Api.getDatasets(store.currentProject)

    const project = store.projectList.get(store.currentProject)
    if (!project) return
    this.datasets = project.datasets

    const experiments = project.experiments
    if (!experiments) return
    experiments.forEach((experiment, experimentId) => {
      this.graph.experimentId = experimentId
      this.graph.experiment = experiment
    })

    this.drawGraph();



    // const container = document.querySelector("[data-cell-id='trained-result-node_testkinsus']")
    // console.log("container",container)
    // const linePlot = new Line(document.getElementById("graph-container")!,{
    //   padding:20,
    //   autoFit:false,
    //   width:100,
    //   height:100,
    //   theme:'dark',
    //   data: this.data,
    //   xField:"epoch",
    //   yField:'accuracy',
  // });
  // bar.chart.data(this.data)

  // linePlot.render();
  
    
  }

  private drawGraph(): void {

    this.graph.graph?.clearCells()
    if (!this.graph.experiment) return
    const graphFlow = GraphService.basicNodes.filter(node => !node.name.includes("processing"))
    this.graph.graph = this.drawFlowChart(window.innerWidth, document.getElementById("graph-container"), graphFlow, this.graph.experiment, this.graph.projectName)
    this.listenOnNodeClick();
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


      if (0 < index && index < array.length) {
        graph?.addEdge({
          source: { cell: `${array[index - 1].name}_${projectName}`, port: "portRight" },
          target: { cell: `${array[index].name}_${projectName}`, port: "portLeft" },
        });
      }
    });

    return graph
  }

  private listenOnNodeClick() {
    this.graph.graph?.on("node:click", (nodeInfo) => {
      const targetDialog: ProcessCellData = nodeInfo.node.data;
      switch (targetDialog.component) {
        case "dataset-node":
          this.openDialogDataset = true;
          break;
        case "preprocess-node":
          // this.openDialogPreprocess = true;
          break;
        case "model-select-node":
          // this.openDialogModelSelect = true;
          break;
        default:
          console.log("out of case");
      }
    });
  }

  private async setDatasetContent(path: string): Promise<void> {

    this.openDialogDataset = false;
    const nodes = this.graph.graph?.getNodes()
    const datasetnode = nodes?.find(node => node.id === `dataset-node_${this.graph.projectName}`)


    await Api.setExperimentDataset(this.graph.projectName, this.graph.experimentId, path)
    this.graph.experiment = store.projectList.get(this.graph.projectName)?.experiments?.get(this.graph.experimentId)

    if (!this.graph.experiment) return
    const sendDatasetStatus = ProcessCellData.cellDataContent(this.graph.experiment, this.graph.projectName).get("dataset-node")

    if (!sendDatasetStatus) return
    sendDatasetStatus.content = sendDatasetStatus?.content.map(item => this.$i18n.t(item).toString())

    datasetnode?.setData(sendDatasetStatus, { overwrite: true })

  }

  private async runExperimentTrain(): Promise<void> {

    const datasetPath = this.graph.experiment?.Config.PrivateSetting.datasetPath
    if (!datasetPath) return

    const datasetStatus = store.projectList.get(this.graph.projectName)?.datasets?.get(datasetPath)
    if (!datasetStatus) return

    if (!datasetStatus.labeled || !datasetStatus.split || !datasetStatus.uploaded) {

      const h = this.$createElement;
      this.$msgbox({
        type: "error",
        confirmButtonText: '確定',
        closeOnClickModal: false,
        message: h('h2', { style: 'color:rgb(8, 100, 141)' }, "當前資料集狀態無法執行實驗")
      })

      return
    }

    const response = await Api.runExperimentTrain(this.graph.projectName, this.graph.experimentId)
    if (response === 'success') this.openDialogRunProject = true

  }

  private goDashBoard(): void {
    this.openDialogRunProject = false
    this.$router.push('/')
  }

}