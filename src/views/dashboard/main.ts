import { Component, Vue } from 'vue-property-decorator';
import { Graph } from "@antv/x6";
import "@antv/x6-vue-shape";


import flowNode from "@/components/flow-node/FlowNode.vue";

@Component
export default class Dashboard extends Vue {

  private projectExist = false;
  private projectName = "";
  private currentComponent = "";


  private newProjectDialogVisible = false;
  private inputKeyVisible = false;
  private keyInput = "";
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
    {
      value: "dataset 003",
      label: "003 dataset",
    },
    {
      value: "dataset 004",
      label: "004 dataset",
    },
    {
      value: "dataset 005",
      label: "005 dataset",
    },
  ]
  private inputModelName = "";
  private activeName = "1";
  private progressColor = "#fff";
  private progressPercentage = 88;
  private projectBuildTime = `${new Date().getFullYear()}.${new Date().getMonth() + 1}.${new Date().getDate()} `;

  private acitveProjectCollapse: string[] = ["1"];
  private dialogTableVisible = false;



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

  created() {

    this.currentComponent = this.$route.name!;

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

  mounted() {

    const elCollapse = document.querySelector(".el-collapse")!;
    const elCollapseWidth: number = elCollapse.clientWidth;
    const nodeWidth: number = elCollapseWidth * 0.11;
    const nodeHeight: number = elCollapseWidth * 0.08;
    const nodeBaseX: number = elCollapseWidth * 0.04;
    const nodeBaseY: number = elCollapseWidth * 0.02;
    const nodeBaseSpace: number = elCollapseWidth * 0.13;


    // add default node and edge
    this.defaultFlow.map((node, index, array) => {
      this.graph?.addNode({
        id: node.name,
        x: nodeBaseX + nodeBaseSpace * index,
        y: nodeBaseY,
        width: nodeWidth,
        height: nodeHeight,
        shape: "vue-shape",
        component: node.name,
        ports: { ...this.port },
      });
    });

    this.graph?.addEdge({
      source: { cell: "dataset-node", port: "portRight" },
      target: { cell: "preprocess-node", port: "portLeft" },
    });

    this.graph?.addEdge({
      source: { cell: "preprocess-node", port: "portRight" },
      target: { cell: "data-argument-node", port: "portLeft" },
    });

    this.graph?.addEdge({
      source: { cell: "data-argument-node", port: "portRight" },
      target: { cell: "model-select-node", port: "portLeft" },
    });

    this.graph?.addEdge({
      source: { cell: "model-select-node", port: "portRight" },
      target: { cell: "validation-select-node", port: "portLeft" },
      attrs: {
        line: {
          strokeDasharray: 5,
        },
      },
    });

    this.graph?.addEdge({
      source: { cell: "validation-select-node", port: "portRight" },
      target: { cell: "training-result-node", port: "portLeft" },
      attrs: {
        line: {
          strokeDasharray: 5,
        },
      },
    });

    this.graph?.addEdge({
      source: { cell: "training-result-node", port: "portRight" },
      target: { cell: "test-result-node", port: "portLeft" },
      attrs: {
        line: {
          strokeDasharray: 5,
        },
      },
    });




    this.graph?.on("node:click", (nodeInfo: any) => {
      console.log("node id", nodeInfo.node.id);

      const targetDialog = nodeInfo.node.component;
      switch (targetDialog) {
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

  private init(): void {

    const elCollapse = document.querySelector(".el-collapse")!;
    const elCollapseWidth: number = elCollapse.clientWidth;

    const graphContainer = document.getElementById("graph-container")!;
    const graphWidth: number = elCollapseWidth * 0.97;
    const graphHeight: number = elCollapseWidth * 0.15;


    this.graph = new Graph({
      container: graphContainer,
      width: graphWidth,
      height: graphHeight,
      // grid: true,

    });


    // 控制连接桩显示/隐藏
    // const showPorts = (ports: any, show: boolean): void => {
    //   for (let i = 0, len = ports.length; i < len; i = i + 1) {
    //     ports[i].style.visibility = show ? "visible" : "hidden";
    //   }
    // };

    // this.graph.on("node:mouseenter", () => {
    //   const ports = graphContainer.querySelectorAll(".x6-port-body");
    //   showPorts(ports, true);
    // });
    // this.graph.on("node:mouseleave", () => {
    //   const ports = graphContainer.querySelectorAll(".x6-port-body");
    //   showPorts(ports, false);
    // });

  }

  private output(): void {
    console.log("get node", this.graph?.toJSON());
  }

}