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
import Icons from '@/constant/icon';
import { Experiment } from '@/io/experiment';

@Component({
  components: {
    "dialog-dataset": DialogDataset,
    "dialog-preprocess": DialogPreprocess,
    "dialog-model-select": DialogModelSelect,
    "flow-node": FlowNode,
  }
})
export default class Experiments extends Vue {

  private acitveProjectCollapse: string[] = ["1"];
  private openDialogRunProject = false;
  private openDialogDataset = false;
  private openDialogPreprocess = false;
  private openDialogModelSelect = false;

  private graph: Graph | null = null;

  private defaultFlow: FlowNodeSettings[] = [
    {
      name: "dataset-node",
      title: "資料集",
      backgroundColor: "#FCEFFD",
      borderColor: "#B811CE",
      icon: Icons.dataset,
    },
    {
      name: "preprocess-node",
      title: "前處理",
      backgroundColor: "#F8F8F0",
      borderColor: "#BCC733",
      icon: Icons.preprocess,
    },
    {
      name: "data-argument-node",
      title: "資料擴增",
      backgroundColor: "#FFF0F0",
      borderColor: "#DD8282",
      icon: Icons.dataAugmentation,
    },
    {
      name: "model-select-node",
      title: "模型選擇",
      backgroundColor: "#F5F5FD",
      borderColor: "#8282DD",
      icon: Icons.modelSelect,
    },
    {
      name: "validation-select-node",
      title: "驗證方法",
      backgroundColor: "#FCFCDF",
      borderColor: "#DE9988",
      icon: Icons.validationSelect,
    },
    {
      name: "trained-result-node",
      title: "訓練結果",
      backgroundColor: "#FAECEC",
      borderColor: "#BC6161",
      icon: Icons.trainedResult,
    },
    {
      name: "test-result-node",
      title: "測試結果",
      backgroundColor: "#FAECEC",
      borderColor: "#C69D16",
      icon: Icons.testedResult,
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
    await Api.getExperiments();
    this.drawGraph();
  }

  private drawGraph(): void {

    this.graph?.clearCells()
    this.graph = this.drawFlowChart(window.innerWidth, document.getElementById("graph-container"), this.defaultFlow)
    this.listenOnNodeClick();
  }

  private drawFlowChart(screenWidth: number, container: HTMLElement | null, flow: FlowNodeSettings[]): Graph | null {
    if (!container) return null;

    const experiments = store.projectList.get(store.currentProject ?? '')?.experiments;
    if (!experiments) return null;

    const graph = new Graph(GraphService.getGraphOption(screenWidth, container));

    const experiment: Experiment = experiments.values().next().value;
    const cellData: Map<string, ProcessCellData> = ProcessCellData.cellDataContent(experiment);

    // add default node and edge
    flow.forEach((node: FlowNodeSettings, index: number, array: FlowNodeSettings[]) => {
      const nodeData = cellData.get(node.name);
      if (!nodeData) return;

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
      currentNode?.setData({ content: nodeData.content })
    });

    return graph
  }

  private listenOnNodeClick() {
    this.graph?.on("node:click", (nodeInfo) => {
      console.log("node data component", nodeInfo.node.data.component);

      const targetDialog: ProcessCellData = nodeInfo.node.data;
      switch (targetDialog.component) {
        case "dataset-node":
          this.openDialogDataset = true;
          break;
        case "preprocess-node":
          this.openDialogPreprocess = true;
          break;
        case "model-select-node":
          this.openDialogModelSelect = true;
          break;
        default:
          console.log("out of case");
      }
    });
  }

  private output(): void {

    const nodes = this.graph?.getNodes()

    if (nodes?.length) {
      nodes?.forEach((node) => {
        node;
        // const { num } = node.getData();
        // node.setData({ num: num + 1 });
      });
    }
  }

  private closeDialogDataset(): void {
    this.openDialogDataset = false;
  }

  private checkDataset(): void {
    this.openDialogDataset = false;
  }

  private closeDialogPreprocess(): void {
    this.openDialogPreprocess = false;
  }

  private closeDialogModelSelect(): void {
    this.openDialogModelSelect = false;
  }
}