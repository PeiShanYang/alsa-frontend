import { Component, Vue } from 'vue-property-decorator';
import { Graph } from "@antv/x6";
import "@antv/x6-vue-shape";
import FlowNode from "@/components/flow-node/FlowNode.vue";
import Api from '@/services/api.service';
import GraphService from "@/services/graph.service";
import FlowNodeSettings from '@/io/flowNodeSettings';
import ProcessCellData from '@/io/processCellData';

import DatasetICON from '@/assets/Forallvision_icon0304/pipe_dataset.svg'
import PreprocessICON from '@/assets/Forallvision_icon0304/pipe_preprocess.svg'
import DataArgumentICON from '@/assets/Forallvision_icon0304/pipe_data_argument.svg'
import ModelSelectICON from '@/assets/Forallvision_icon0304/pipe_model_select.svg'
import ValidationSelectICON from '@/assets/Forallvision_icon0304/pipe_validation_select.svg'
import TrainedResultICON from '@/assets/Forallvision_icon0304/pipe_trained_result.svg'
import TestedResultICON from '@/assets/Forallvision_icon0304/pipe_tested_result.svg'
import store from '@/services/store.service';


@Component({
  components: {
    "flow-node": FlowNode,
  }
})
export default class Dashboard extends Vue {

  private projectExist = false;

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
  private activeName = "1";

  private acitveProjectCollapse: string[] = ["1"];
  private dialogTableVisible = false;

  private projectNameList: string[] = [];


  private graph: Graph | null = null;

  private defaultFlow: FlowNodeSettings[] = [
    {
      name: "dataset-node",
      title: "資料集",
      backgroundColor: "#FCEFFD",
      borderColor: "#B811CE",
      icon: DatasetICON,
    },
    {
      name: "preprocess-node",
      title: "前處理",
      backgroundColor: "#F8F8F0",
      borderColor: "#BCC733",
      icon: PreprocessICON,
    },
    {
      name: "data-argument-node",
      title: "資料擴增",
      backgroundColor: "#FFF0F0",
      borderColor: "#DD8282",
      icon: DataArgumentICON,
    },
    {
      name: "model-select-node",
      title: "模型選擇",
      backgroundColor: "#F5F5FD",
      borderColor: "#8282DD",
      icon: ModelSelectICON,
    },
    {
      name: "validation-select-node",
      title: "驗證方法",
      backgroundColor: "#FCFCDF",
      borderColor: "#DE9988",
      icon: ValidationSelectICON,
    },
    {
      name: "trained-result-node",
      title: "訓練結果",
      backgroundColor: "#FAECEC",
      borderColor: "#BC6161",
      icon: TrainedResultICON,
    },
    {
      name: "test-result-node",
      title: "測試結果",
      backgroundColor: "#FAECEC",
      borderColor: "#C69D16",
      icon: TestedResultICON,
    },
  ]

  created(): void {

    // register node on Graph
    this.defaultFlow.forEach((node) => {
      Graph.registerVueComponent(
        node.name,
        {
          template: `<flow-node
            icon= ${node.icon}
            title=${node.title}
            background-color = ${node.backgroundColor}
            border-color = ${node.borderColor}
          />`,
          components: { FlowNode },
        },
        true
      );
    });

    window.addEventListener("resize", this.resizeHandler)

  }

  mounted(): void {

    // console.log("store", store.projectList.keys())
    if (store.projectList.size !== 0) {
      this.projectExist = true
      this.projectNameList = Array.from(store.projectList.keys())
    }


    this.graph = this.drawFlowChart(window.innerWidth, document.getElementById("graph-container"), this.defaultFlow)
    this.listenOnNodeClick();

  }

  destroy(): void {

    window.removeEventListener("resize", this.resizeHandler)
  }

  get projectName(): string {
    return this.$route.params.projectName
  }

  private resizeHandler(): void {

    this.graph?.clearCells()
    this.graph = this.drawFlowChart(window.innerWidth, document.getElementById("graph-container"), this.defaultFlow)
    this.listenOnNodeClick();
  }

  private drawFlowChart(screenWidth: number, container: HTMLElement | null, flow: FlowNodeSettings[]): Graph | null {
    if (!container) return null;

    const experimentsObj = store.projectList.get(store.projectList.keys().next().value)?.experiments
    const experimentsData = Object.values(experimentsObj!)[0]

    console.log("expData", experimentsData)

    const graph = new Graph(GraphService.getGraphOption(screenWidth, container));

    // add default node and edge
    flow.forEach((node: FlowNodeSettings, index: number, array: FlowNodeSettings[]) => {



      // console.log(ProcessCellData.cellDataContent(node.name,experimentsData))
      // const nodeData: ProcessCellData = ProcessCellData.cellDataContent(node.name, experimentsData)


      // if (node.name === "dataset-node" && store.currentDatasetStatus) {


      //   if (store.currentDatasetStatus.uploaded) nodeData.content[0] = "已上傳"
      //   if (store.currentDatasetStatus.labeled) nodeData.content[1] = "已標記"
      //   if (store.currentDatasetStatus.split) nodeData.content[2] = "已切分"
      // }




      graph?.addNode({
        ...GraphService.getNodeSettings(screenWidth, index),
        id: node.name,
        component: node.name,
        data: {
          content: "",
        },
      });

      if (0 < index && index < array.length) {
        graph?.addEdge({
          source: { cell: array[index - 1].name, port: "portRight" },
          target: { cell: array[index].name, port: "portLeft" },
        });
      }

      const nodes = graph.getNodes()
      const currentNode = nodes.find(element => element.id === node.name)
      // console.log("nodes",nodes,currentNode)
      // currentNode?.setData({ content: nodeData.content })


    });

    return graph
  }

  private listenOnNodeClick() {
    this.graph?.on("node:click", (nodeInfo) => {
      console.log("node id", nodeInfo.node.id, nodeInfo);

      const targetDialog: ProcessCellData = nodeInfo.node.data;
      switch (nodeInfo.node.id) {
        case "dataset-node":
          // this.openDialogDataset = true;
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


}