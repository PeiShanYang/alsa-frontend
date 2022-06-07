import { Component, Vue } from 'vue-property-decorator';
import { Graph } from "@antv/x6";
import "@antv/x6-vue-shape";
import DialogDataset from '@/components/dialog-dataset/DialogDataset.vue';
import DialogPreprocess from '@/components/dialog-preprocess/DialogPreprocess.vue';
import DialogModelSelect from '@/components/dialog-model-select/DialogModelSelect.vue';
import FlowNode from "@/components/flow-node/FlowNode.vue";
import DialogMessage from '@/components/dialog-message/DialogMessage.vue';

import Api from '@/services/api.service';
import GraphService from "@/services/graph.service";
import FlowNodeSettings from '@/io/flowNodeSettings';
import ProcessCellData from '@/io/processCellData';
import DialogMessageData from '@/io/dialogMessageData';

import store from '@/services/store.service';
import { Experiment } from '@/io/experiment';
import { DatasetStatus } from '@/io/dataset';
import graphData from '@/io/graphData';

@Component({
  components: {
    "dialog-dataset": DialogDataset,
    "dialog-preprocess": DialogPreprocess,
    "dialog-model-select": DialogModelSelect,
    "flow-node": FlowNode,
    "dialog-message": DialogMessage,
  }
})
export default class Experiments extends Vue {

  private acitveProjectCollapse: string[] = ["1"];
  private openDialogMessage = false;
  private openDialogRunProject = false;
  private openDialogDataset = false;
  private openDialogPreprocess = false;
  private openDialogModelSelect = false;

  private dialogMessageData: DialogMessageData = new DialogMessageData()

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

  }

  private drawGraph(): void {

    this.graph.graph?.clearCells()
    if (!this.graph.experiment) return
    const graphFlow = GraphService.basicNodes
      .filter(node => !node.name.includes("processing"))
      .filter(node => !node.name.includes("trained-result-node"))
      .filter(node => !node.name.includes("test-result-node"))
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

      if (nodeData.component === 'dataset-node') this.displayDatasetToolTip(graph, nodeData.content)

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
    if (!this.graph.graph) return
    const nodes = this.graph.graph.getNodes()
    const datasetnode = nodes.find(node => node.id === `dataset-node_${this.graph.projectName}`)


    await Api.setExperimentDataset(this.graph.projectName, this.graph.experimentId, path)
    this.graph.experiment = store.projectList.get(this.graph.projectName)?.experiments?.get(this.graph.experimentId)

    if (!this.graph.experiment) return
    const sendDatasetStatus = ProcessCellData.cellDataContent(this.graph.experiment, this.graph.projectName).get("dataset-node")

    if (!sendDatasetStatus) return
    sendDatasetStatus.content = sendDatasetStatus?.content.map(item => this.$i18n.t(item).toString())

    datasetnode?.setData(sendDatasetStatus, { overwrite: true })

    this.displayDatasetToolTip(this.graph.graph, sendDatasetStatus.content)

  }


  private displayDatasetToolTip(graph: Graph, content: string[]): void {

    const contentFilter = content.filter(item => item === '未上傳' || item === '未標記' || item === '未切分')
    const nodeId = 'dataset_tooltip'
    const nodes = graph.getNodes()
    const tipNode = nodes.find((node => node.id === nodeId))

    if (contentFilter.length !== 0 && !tipNode) {
      graph.addNode({
        id: nodeId,
        shape: 'path',
        x: 35,
        y: 190,
        width: 200,
        height: 60,
        path: 'M 0 0.5 L 0.5 1 L 11 1 L 11 3 L -1 3 L -1 1 L -0.5 1 Z',
        attrs: {
          body: {
            fill: '#951414',
            stroke: '#951414',
          },
          label: {
            text: '請設定有效的資料集',
            x: 6,
            y: 6,
            fill: '#fff'
          },
        },
      })
    }

    if (contentFilter.length === 0 && tipNode) {
      graph.removeCell(nodeId)
    }

  }

  private async runExperimentTrain(): Promise<void> {

    const datasetPath = this.graph.experiment?.Config.PrivateSetting.datasetPath
    if (!datasetPath){
      const h = this.$createElement;
      this.$message({
        type: 'warning',
        message: h('h3', { style: 'color:#E6A23C;' }, "請先設定資料夾路徑"),
      })
      return
    } 

    const datasetStatus = store.projectList.get(this.graph.projectName)?.datasets?.get(datasetPath)
    if (!datasetStatus){
      const h = this.$createElement;
      this.$message({
        type: 'warning',
        message: h('h3', { style: 'color:#E6A23C;' }, "請先設定資料夾路徑"),
      })
      return
    } 

    if (!datasetStatus.labeled || !datasetStatus.split || !datasetStatus.uploaded) {
      const h = this.$createElement;
      this.$message({
        type: 'warning',
        message: h('h3', { style: 'color:#E6A23C;' }, "請先完成資料集的 上傳、標註、切分的任務"),
      })
      return
    }

    const runTrainResponse = await Api.runExperimentTrain(this.graph.projectName, this.graph.experimentId)
    if (runTrainResponse.runId === '') return
    const runTestResponse = await Api.runExperimentTest(this.graph.projectName, this.graph.experimentId, runTrainResponse.runId)
    if (runTestResponse.runId === '') return

    this.dialogMessageData = {
      type: 'info',
      title: '請至 Dashboard 查看執行進度為何',
      cancelBtnName: '稍後再說',
      confirmBtnName: '前往查看',
    }
    this.openDialogMessage = true

  }

  private goDashBoard(): void {
    this.openDialogMessage = false
    this.$router.push('/')
  }

}