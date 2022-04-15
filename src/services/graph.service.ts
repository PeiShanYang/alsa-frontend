
import { Options } from "@antv/x6/lib/graph/options";
import { PortManager } from "@antv/x6/lib/model/port";
import { Graph } from "@antv/x6";
import "@antv/x6-vue-shape";

import FlowNodeSettings from "@/io/flowNodeSettings";
import Icons from '@/constant/icon';
import FlowNode from "@/components/flow-node/FlowNode.vue";

export default class GraphService {
  static readonly ports = {
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

  static readonly basicNodes: FlowNodeSettings[] = [
    {
      name: "dataset-node",
      title: "資料集",
      backgroundColor: "#FCEFFD",
      borderColor: "#B811CE",
      icon: Icons.dataset,
      opacity:1,
    },
    {
      name: "preprocess-node",
      title: "前處理",
      backgroundColor: "#F8F8F0",
      borderColor: "#BCC733",
      icon: Icons.preprocess,
      opacity:1,
    },
    {
      name: "data-argument-node",
      title: "資料擴增",
      backgroundColor: "#FFF0F0",
      borderColor: "#DD8282",
      icon: Icons.dataAugmentation,
      opacity:1,
    },
    {
      name: "model-select-node",
      title: "模型訓練",
      backgroundColor: "#F5F5FD",
      borderColor: "#8282DD",
      icon: Icons.modelSelect,
      opacity:1,
    },
    {
      name: "model-select-node-processing",
      title: "模型訓練",
      backgroundColor: "#F5F5FD",
      borderColor: "#8282DD",
      icon: Icons.modelSelect,
      opacity:0.5,
    },
    {
      name: "validation-select-node",
      title: "驗證方法",
      backgroundColor: "#FCFCDF",
      borderColor: "#DE9988",
      icon: Icons.validationSelect,
      opacity:1,
    },
    {
      name: "validation-select-node-processing",
      title: "驗證方法",
      backgroundColor: "#FCFCDF",
      borderColor: "#DE9988",
      icon: Icons.validationSelect,
      opacity:0.5,
    },
    {
      name: "trained-result-node",
      title: "訓練結果",
      backgroundColor: "#FAECEC",
      borderColor: "#BC6161",
      icon: Icons.trainedResult,
      opacity:1,
    },
    {
      name: "trained-result-node-processing",
      title: "訓練結果",
      backgroundColor: "#FAECEC",
      borderColor: "#BC6161",
      icon: Icons.trainedResult,
      opacity:0.5,
    },
    {
      name: "test-result-node",
      title: "測試結果",
      backgroundColor: "#FAECEC",
      borderColor: "#C69D16",
      icon: Icons.testedResult,
      opacity:1,
    },
    {
      name: "test-result-node-processing",
      title: "測試結果",
      backgroundColor: "#FAECEC",
      borderColor: "#C69D16",
      icon: Icons.testedResult,
      opacity:0.5,
    },
  ]

  static getGraphOption(screenWidth: number, container: HTMLElement): Partial<Options.Manual> {
    return {
      container,
      width: screenWidth * 0.8,
      height: screenWidth * 0.15,
      // grid: true,
      panning: true,
      interacting: false,
    }
  }

  static getNodeSettings(screenWidth: number, index: number): {
    x: number;
    y: number;
    width: number;
    height: number;
    shape: string;
    ports: Partial<PortManager.Metadata>;
  } {
    const nodeWidth = screenWidth * 0.08;
    const nodeHeight = screenWidth * 0.07;

    let nodeBaseX = 0
    if (screenWidth > 1200) nodeBaseX = screenWidth * 0.02

    const nodeBaseY = screenWidth * 0.03;
    const nodeBaseSpace = screenWidth * 0.11;

    return {
      x: nodeBaseX + nodeBaseSpace * index,
      y: nodeBaseY,
      width: nodeWidth,
      height: nodeHeight,
      shape: "vue-shape",
      ports: GraphService.ports,
    }
  }

  static registerNodes(): void {

    GraphService.basicNodes.forEach(node => {
      Graph.registerVueComponent(
        node.name,
        {
          template: `<flow-node
            icon= ${node.icon}
            title=${node.title}
            background-color = ${node.backgroundColor}
            border-color = ${node.borderColor}
            opacity = ${node.opacity}
          />`,
          components: { FlowNode },
        },
        true
      )
    })
  }
}