import { Component, Vue } from 'vue-property-decorator';
import { Graph } from "@antv/x6";
import "@antv/x6-vue-shape";


import DialogDataset from '@/components/dialog-dataset/DialogDataset.vue';
import DialogPreprocess from '@/components/dialog-preprocess/DialogPreprocess.vue';
import DialogModelSelect from '@/components/dialog-model-select/DialogModelSelect.vue';
import FlowNode from "@/components/flow-node/FlowNode.vue";
import Api from '@/services/api.service';
import Dataset from '../dataset/main';
import GraphService, { NodeSettings } from "@/services/graph.service";


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

  private defaultFlow: Array<{
    name: string,
    title: string,
    content: { type: string, info: any },
    backgroundColor: string,
    borderColor: string,
    icon: string,
  }> = [
      {
        name: "dataset-node",
        title: "資料集",
        content: {
          "type": "object",
          "info": Dataset
        },
        backgroundColor: "#EDEDED",
        borderColor: "#2F4F4F",
        icon: "https://cdn-icons-png.flaticon.com/512/2400/2400721.png",
      },
      {
        name: "preprocess-node",
        title: "前處理",
        content: {
          "type": "array",
          "info": [],
        },
        backgroundColor: "#F8F8F0",
        borderColor: "#BCC733",
        icon: "https://cdn-icons-png.flaticon.com/512/2400/2400721.png",
      },
      {
        name: "data-argument-node",
        title: "資料擴增",
        content: {
          "type": "array",
          "info": [],
        },
        backgroundColor: "#FFF0F0",
        borderColor: "#DD8282",
        icon: "https://cdn-icons-png.flaticon.com/512/2400/2400721.png",
      },
      {
        name: "model-select-node",
        title: "模型訓練",
        content: {
          "type": "string",
          "info": '',
        },
        backgroundColor: "#F5F5FD",
        borderColor: "#8282DD",
        icon: "https://cdn-icons-png.flaticon.com/512/2400/2400721.png",
      },
      {
        name: "validation-select-node",
        title: "驗證方法",
        content: {
          "type": "array",
          "info": [],
        },
        backgroundColor: "#FCFCDF",
        borderColor: "#DE9988",
        icon: "https://cdn-icons-png.flaticon.com/512/2400/2400721.png",
      },
      {
        name: "training-result-node",
        title: "驗證結果",
        content: {
          "type": "array",
          "info": [],
        },
        backgroundColor: "#FAECEC",
        borderColor: "#BC6161",
        icon: "https://cdn-icons-png.flaticon.com/512/2400/2400721.png",
      },
      {
        name: "test-result-node",
        title: "測試結果",
        content: {
          "type": "array",
          "info": [],
        },
        backgroundColor: "#FAECEC",
        borderColor: "#C69D16",
        icon: "https://cdn-icons-png.flaticon.com/512/2400/2400721.png",
      },
    ]


  created(): void {
    Api.getExperiments();

    window.addEventListener("resize", this.resizeHandler)

    this.defaultFlow.map((node) => {
      Graph.registerVueComponent(
        node.name,
        {
          template: `<flow-node 
            node-icon= ${node.icon} 
            node-title=${node.title} 
            node-content=${JSON.stringify(node.content)}
            node-background-color = ${node.backgroundColor}
            node-border-color = ${node.borderColor}
             />`,
          components: { FlowNode },
        },
        true
      );
    });
  }

  mounted(): void {

    this.graph = this.drawFlowChart(window.innerWidth, document.getElementById("graph-container"), this.graph!, this.defaultFlow)
  }

  destroy(): void {

    window.removeEventListener("resize", this.resizeHandler)
  }

  get projectName(): string {
    return this.$route.params.projectName
  }

  private resizeHandler(): void {

    this.graph?.clearCells()
    this.graph = this.drawFlowChart(window.innerWidth, document.getElementById("graph-container"), this.graph!, this.defaultFlow)
  }

  private drawFlowChart(screenWidth: number, container: HTMLElement | null, graph: Graph, flow: any): Graph {

    if (container) {

      graph = new Graph(GraphService.getGraphOption(screenWidth, container));

      // add default node and edge
      flow.forEach((node: NodeSettings, index: number, array: any) => {
        graph?.addNode({
          ...GraphService.getNodeSettings(screenWidth, index),
          id: node.name,
          data: {
            component: node.name,
            num: 0,
          },
        })

        if (0 < index && index < array.length) {
          graph?.addEdge({
            source: { cell: array[index - 1].name, port: "portRight" },
            target: { cell: array[index].name, port: "portLeft" },
          });
        }
      });
    };

    this.listenOnNodeClick();
    return graph
  }

  private listenOnNodeClick() {
    this.graph!.on("node:click", (nodeInfo: any) => {
      console.log("node id", nodeInfo.node.id, nodeInfo);

      const targetDialog = nodeInfo.node.component;
      switch (targetDialog) {
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

    if (nodes!.length) {
      nodes!.forEach((node) => {
        const { num } = node.getData();
        node.setData({ num: num + 1 });
      });
    }

    // console.log("getNode", nodes)
    // console.log("get node list", this.graph?.toJSON());
  }


  private closeDialogDataset(): void {
    this.openDialogDataset = false;
  }

  private checkDataset(): void {
    this.openDialogDataset = false;
  }

  private closeDialogPreprocess(value: boolean): void {
    this.openDialogPreprocess = value;
  }

  private closeDialogModelSelect(value: boolean): void {
    this.openDialogModelSelect = value;
  }
}