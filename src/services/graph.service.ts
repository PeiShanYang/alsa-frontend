
import { Options } from "@antv/x6/lib/graph/options";
import { PortManager } from "@antv/x6/lib/model/port";
import { Graph } from "@antv/x6";
import "@antv/x6-vue-shape";

import FlowNodeSettings from "@/io/flowNodeSettings";
import {ExperimentsIcons} from '@/constant/icon';
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
      title: "?????????",
      backgroundColor: "#FCEFFD",
      borderColor: "#B811CE",
      icon: ExperimentsIcons.dataset,
      opacity:1,
    },
    {
      name: "preprocess-node",
      title: "?????????",
      backgroundColor: "#F8F8F0",
      borderColor: "#BCC733",
      icon: ExperimentsIcons.preprocess,
      opacity:1,
    },
    {
      name: "augmentation-node",
      title: "????????????",
      backgroundColor: "#FFF0F0",
      borderColor: "#DD8282",
      icon: ExperimentsIcons.dataAugmentation,
      opacity:1,
    },
    {
      name: "model-select-node",
      title: "????????????",
      backgroundColor: "#F5F5FD",
      borderColor: "#8282DD",
      icon: ExperimentsIcons.modelSelect,
      opacity:1,
    },
    {
      name: "validation-select-node",
      title: "????????????",
      backgroundColor: "#FCFCDF",
      borderColor: "#DE9988",
      icon: ExperimentsIcons.validationSelect,
      opacity:1,
    },
    {
      name: "trained-result-node",
      title: "????????????",
      backgroundColor: "#FAECEC",
      borderColor: "#BC6161",
      icon: ExperimentsIcons.trainedResult,
      opacity:1,
    },
    {
      name: "test-result-node",
      title: "????????????",
      backgroundColor: "#FAECEC",
      borderColor: "#C69D16",
      icon: ExperimentsIcons.testedResult,
      opacity:1,
    },
  ]

  static getGraphOption(screenWidth: number, container: HTMLElement): Partial<Options.Manual> {
    return {
      container,
      width: screenWidth * 0.8,
      height: screenWidth * 0.15,
      // grid: true,
      // panning: true,
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
    const nodeWidth = screenWidth * 0.1;
    const nodeHeight = screenWidth * 0.07;

    const nodeBaseX = screenWidth * 0.01
 
    const nodeBaseY = screenWidth * 0.03;
    const nodeBaseSpace = screenWidth * 0.13;

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
          template: `<flow-node />`,
          components: { FlowNode },
        },
        true
      )
    })
  }
}