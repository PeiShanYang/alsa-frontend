import { Options } from "@antv/x6/lib/graph/options";
import { PortManager } from "@antv/x6/lib/model/port";

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
    const nodeBaseSpace = screenWidth * 0.1;

    return {
      x: nodeBaseX + nodeBaseSpace * index,
      y: nodeBaseY,
      width: nodeWidth,
      height: nodeHeight,
      shape: "vue-shape",
      ports: GraphService.ports,
    }
  }
}