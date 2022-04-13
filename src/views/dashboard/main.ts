import { Component, Vue, Watch } from 'vue-property-decorator';
import { Graph } from "@antv/x6";
import "@antv/x6-vue-shape";
import FlowNode from "@/components/flow-node/FlowNode.vue";
import Api from '@/services/api.service';
import GraphService from "@/services/graph.service";
import FlowNodeSettings from '@/io/flowNodeSettings';
import ProcessCellData from '@/io/processCellData';
import graphData from '@/io/graphData';




import store from '@/services/store.service';
import Icons from '@/constant/icon';
import { Experiment } from '@/io/experiment';
import { Project } from "@/io/project";

@Component({
  components: {
    "flow-node": FlowNode,
  }
})

export default class Dashboard extends Vue {

  private projectExist = false;


  // search project setting related 
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

  // collapse related 

  private progressColor = '#ffffff'

  private acitveProjectCollapse: string[] = [];

  private graphs: Array<graphData> = [];

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

  @Watch('acitveProjectCollapse')
  onCollapse(newActive: string[], oldActive: string[]): void {

    const diffProject = newActive.filter(x => !oldActive.includes(x))[0]
    const repaintGraph = this.graphs.find(x => x.projectName === diffProject)

    this.$nextTick(() => {
      if (!repaintGraph) return
      repaintGraph.graph?.clearCells()
      if (!repaintGraph.experiment) return
      repaintGraph.graph = this.drawFlowChart(window.innerWidth, document.getElementById(repaintGraph.projectName), this.defaultFlow, repaintGraph.experiment, repaintGraph.projectName)
    })


  }

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
    this.waitGetAllProjectInfo()
  }

  destroy(): void {
    window.removeEventListener("resize", this.drawGraph)
  }

  get projectList(): Map<string, Project> {
    return store.projectList
  }

  private async waitGetAllProjectInfo(): Promise<void> {

    const loadingInstance = this.$loading({target:document.getElementById("mainSection")??""})

    await Api.getProjects();
    if (this.projectList.size === 0){
      loadingInstance.close()
      return
    } 
    this.projectExist = true

    const projectKeys = [...this.projectList.keys()]
    this.acitveProjectCollapse = projectKeys
    for (let index = 0; index < this.projectList.size; index++) {
      await Api.getExperiments(projectKeys[index]);
      await Api.getDatasets(projectKeys[index]);
      await Api.getInformationTrain()
    }

    this.graphInitSetting()

    
    // if (store.currentProject){
    //   this.acitveProjectCollapse = [store.currentProject]
    // } else{
    //   this.acitveProjectCollapse = [projectKeys[0]]
    // }

    this.drawGraph();

    

    loadingInstance.close()

  }

  private graphInitSetting(): void {
    this.projectList.forEach((project, projectName) => {

      if (!project.experiments) return
      project.experiments.forEach((experiment, experimentId) => {
        this.graphs.push({
          graph: null,
          projectName, experimentId, experiment
        })

      })
    })
  }


  private drawGraph(): void {

    if (this.graphs.length === 0) return

    this.graphs.forEach((item) => {
      item.graph?.clearCells()
      if (!item.experiment) return
      item.graph = this.drawFlowChart(window.innerWidth, document.getElementById(item.projectName), this.defaultFlow, item.experiment, item.projectName)
    })
  }


  private drawFlowChart(screenWidth: number, container: HTMLElement | null, flow: FlowNodeSettings[], experiment: Experiment, projectName: string): Graph | null {

    if (!container) return null;

    const graph = new Graph(GraphService.getGraphOption(screenWidth, container));

    const cellData: Map<string, ProcessCellData> = ProcessCellData.cellDataContent(experiment, projectName);


    // add default node and edge
    flow.forEach((node: FlowNodeSettings, index: number, array: FlowNodeSettings[]) => {
      const nodeData = cellData.get(node.name);

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

  private progressFormat(percentage:number):string{
    return percentage === 100 ? "已完成" : `${percentage}% 進行中`
  }

}