import { Component, Vue } from 'vue-property-decorator';
import { Graph } from "@antv/x6";
import "@antv/x6-vue-shape";


import DialogDataset from '@/components/dialog-dataset/DialogDataset.vue';
import DialogPreprocess from '@/components/dialog-preprocess/DialogPreprocess.vue';
import DialogModelSelect from '@/components/dialog-model-select/DialogModelSelect.vue';
import flowNode from "@/components/flow-node/FlowNode.vue";
import Api from '@/services/api.service';
import store from "@/services/store.service";


@Component({
  components: {
    "dialog-dataset": DialogDataset,
    "dialog-preprocess": DialogPreprocess,
    "dialog-model-select": DialogModelSelect,
  }
})
export default class Experiments extends Vue {


  get projectName(): string {
    return this.$route.params.projectName
  }

  private acitveProjectCollapse: string[] = ["1"];
  private openDialogRunProject = false;
  private openDialogDataset = false;
  private openDialogPreprocess = false;
  private openDialogModelSelect = false;

  private allFlowContent = null;

  private graph: Graph | null = null;
  private port: any = {
    groups: {
      top: {
        position: "top",
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: "#5F95FF",
            strokeWidth: 1,
            fill: "#fff",
            style: {
              visibility: "hidden",
            },
          },
        },
      },
      right: {
        position: "right",
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: "#5F95FF",
            strokeWidth: 1,
            fill: "#fff",
            style: {
              visibility: "hidden",
            },
          },
        },
      },
      bottom: {
        position: "bottom",
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: "#5F95FF",
            strokeWidth: 1,
            fill: "#fff",
            style: {
              visibility: "hidden",
            },
          },
        },
      },
      left: {
        position: "left",
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: "#5F95FF",
            strokeWidth: 1,
            fill: "#fff",
            style: {
              visibility: "hidden",
            },
          },
        },
      },
    },
    items: [
      {
        id: "portTop",
        group: "top",
      },
      {
        id: "portRight",
        group: "right",
      },
      {
        id: "portBottom",
        group: "bottom",
      },
      {
        id: "portLeft",
        group: "left",
      },
    ],
  }


  private defaultFlow: Array<{
    name: string,
    title: string,
    content: string,
    backgroundColor: string,
    borderColor: string,
    icon: string,
  }> = [
      {
        name: "dataset-node",
        title: "資料集",
        content: "文字描述",
        backgroundColor: "#EDEDED",
        borderColor: "#2F4F4F",
        icon: "https://cdn-icons-png.flaticon.com/512/2400/2400721.png",
      },
      {
        name: "preprocess-node",
        title: "前處理",
        content: '文字敘述',
        backgroundColor: "#F8F8F0",
        borderColor: "#BCC733",
        icon: "https://cdn-icons-png.flaticon.com/512/2400/2400721.png",
      },
      {
        name: "data-argument-node",
        title: "資料擴增",
        content: "文字描述",
        backgroundColor: "#FFF0F0",
        borderColor: "#DD8282",
        icon: "https://cdn-icons-png.flaticon.com/512/2400/2400721.png",
      },
      {
        name: "model-select-node",
        title: "模型訓練",
        content: "文字描述",
        backgroundColor: "#F5F5FD",
        borderColor: "#8282DD",
        icon: "https://cdn-icons-png.flaticon.com/512/2400/2400721.png",
      },
      {
        name: "validation-select-node",
        title: "驗證方法",
        content: "文字描述",
        backgroundColor: "#FCFCDF",
        borderColor: "#DE9988",
        icon: "https://cdn-icons-png.flaticon.com/512/2400/2400721.png",
      },
      {
        name: "training-result-node",
        title: "驗證結果",
        content: "文字描述",
        backgroundColor: "#FAECEC",
        borderColor: "#BC6161",
        icon: "https://cdn-icons-png.flaticon.com/512/2400/2400721.png",
      },
      {
        name: "test-result-node",
        title: "測試結果",
        content: "文字描述",
        backgroundColor: "#FAECEC",
        borderColor: "#C69D16",
        icon: "https://cdn-icons-png.flaticon.com/512/2400/2400721.png",
      },
    ]


  created(): void {
    Api.getExperiments(this.projectName)


    const experiment = store.projectList.find(project => project.name === this.projectName)?.experiments
    // const test = Object.values(experiment!)
    if (experiment){
      this.allFlowContent = Object.values(experiment)[0]
      
    }

    console.log("all flow",this.allFlowContent)

    window.addEventListener("resize", this.resizeHandler)
    

    this.defaultFlow.map((node) => {
      Graph.registerVueComponent(
        node.name,
        {
          template: `<flow-node 
            node-icon= ${node.icon} 
            node-title=${node.title} 
            node-content=${node.content}
            node-background-color = ${node.backgroundColor}
            node-border-color = ${node.borderColor}
             />`,
          components: { flowNode },
        },
        true
      );
    });
  }

  mounted(): void {

    this.drawFlowChart(window.innerWidth, document.getElementById("graph-container"), this.graph, this.defaultFlow)
  }

  destroy(): void {

    window.removeEventListener("resize", this.resizeHandler)
  }

  private resizeHandler(): void {

    this.graph?.clearCells()
    this.drawFlowChart(window.innerWidth, document.getElementById("graph-container"), this.graph, this.defaultFlow)
  }


  private drawFlowChart(screanWidth: number, container: HTMLElement | null, graph: Graph | null, flow: any): void {

    const containerWidth = screanWidth * 0.8;
    const containerHeight = screanWidth * 0.15;
    const nodeWidth = screanWidth * 0.08;
    const nodeHeight = screanWidth * 0.07;

    let nodeBaseX = 0
    if (screanWidth > 1200) nodeBaseX = screanWidth*0.02

    const nodeBaseY = screanWidth * 0.03;
    const nodeBaseSpace = screanWidth * 0.1;

    if (container) {

      graph = new Graph({
        container: container,
        width: containerWidth,
        height: containerHeight,
        // grid: true,
        panning: true,
      })

      // add default node and edge
      flow.forEach((node: any, index: any, array: any) => {
        graph?.addNode({
          id: node.name,
          x: nodeBaseX + nodeBaseSpace * index,
          y: nodeBaseY,
          width: nodeWidth,
          height: nodeHeight,
          shape: "vue-shape",
          component: node.name,
          ports: { ...this.port },
        })

        if (0 < index && index < array.length) {
          graph?.addEdge({
            source: { cell: array[index - 1].name, port: "portRight" },
            target: { cell: array[index].name, port: "portLeft" },
          });
        }

      });

      graph.on("node:click", (nodeInfo: any) => {
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

  }

  private output(): void {
    console.log("get node", this.graph?.toJSON());
  }


  private closeDialogDataset(value: boolean): void {
    this.openDialogDataset = value;
  }

  private closeDialogPreprocess(value: boolean): void {
    this.openDialogPreprocess = value;
  }

  private closeDialogModelSelect(value: boolean): void {
    this.openDialogModelSelect = value;
  }
}