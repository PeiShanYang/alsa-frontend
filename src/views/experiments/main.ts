import { Component, Vue } from 'vue-property-decorator';
import { Graph, Scheduler } from "@antv/x6";
import "@antv/x6-vue-shape";

import DialogDataset from '@/components/dialogs/dialog-dataset/DialogDataset.vue';
import DialogPreprocess from '@/components/dialogs/dialog-preprocess/DialogPreprocess.vue';
import DialogAugmentation from '@/components/dialogs/dialog-augmentation/DialogAugmentation.vue';
import DialogModelSelect from '@/components/dialogs/dialog-model-select/DialogModelSelect.vue';
import DialogMessage from '@/components/dialogs/dialog-message/DialogMessage.vue';

import Api from '@/services/api.service';
import GraphService from "@/services/graph.service";
import FlowNodeSettings from '@/io/flowNodeSettings';
import ProcessCellData from '@/io/processCellData';
import DialogMessageData from '@/io/dialogMessageData';

import store from '@/services/store.service';
import { AugmentationPara, Experiment, ModelSelectPara, PreprocessPara, SchedulerPara, OptimizerPara } from '@/io/experiment';
import graphData from '@/io/graphData';
import { StringUtil } from '@/utils/string.util';
import { ConfigType } from '@/io/experimentConfig';
import Logger from '@/services/log.service';


@Component({
  components: {
    "dialog-message": DialogMessage,
    "dialog-dataset": DialogDataset,
    "dialog-preprocess": DialogPreprocess,
    "dialog-augmentation": DialogAugmentation,
    "dialog-model-select": DialogModelSelect,
  }
})
export default class Experiments extends Vue {

  private graph = new graphData();

  private openDialogMessage = false;
  private dialogMessageData: DialogMessageData = new DialogMessageData()

  private dialogExperimentId = ''

  private openDialogDataset = false;
  private openDialogPreprocess = false;
  private openDialogAugmentation = false;
  private openDialogModelSelect = false;

  private dialogDatasetPara = '';
  private dialogPreprocessPara: PreprocessPara = new PreprocessPara()
  private dialogAugmentationPara: AugmentationPara = new AugmentationPara()
  private dialogModelSelectPara: ModelSelectPara = new ModelSelectPara()

  private openDialogRunProject = false;

  private showSolutionKey = false

  get projectName(): string {
    return this.$route.params.projectName
  }

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

  private async waitGetExperiments(): Promise<void> {

    if (!store.currentProject) return
    await Api.getExperiments(store.currentProject)
    if (!store.experimentConfigs) await Api.getExperimentConfigs()

    const project = store.projectList.get(store.currentProject)
    if (!project) return

    // init this graph
    this.graph.projectName = project.name

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

  private displayDatasetToolTip(graph: Graph, content: string[]): void {

    const contentFilter = content.filter(item => item === '未上傳' || item === '未標記' || item === '未切分')
    const nodeId = 'dataset_tooltip'
    const nodes = graph.getNodes()
    const tipNode = nodes.find((node => node.id === nodeId))

    const graphSetting = GraphService.getNodeSettings(window.innerWidth, 0)

    if (contentFilter.length !== 0 && !tipNode) {
      graph.addNode({
        id: nodeId,
        shape: 'path',
        x: graphSetting.x,
        y: graphSetting.y * 3.5,
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

  private listenOnNodeClick(): void {

    this.graph.graph?.on("node:click", (nodeInfo) => {

      if (!this.graph.experiment) return
      if (!store.experimentConfigs) return
      const targetDialog: ProcessCellData = nodeInfo.node.data;

      switch (targetDialog.component) {
        case "dataset-node":
          this.dialogExperimentId = this.graph.experimentId
          this.dialogDatasetPara = this.graph.experiment.Config.PrivateSetting.datasetPath ?? ''
          this.openDialogDataset = true
          break;
        case "preprocess-node":
          this.dialogExperimentId = this.graph.experimentId
          this.dialogPreprocessPara = this.graph.experiment.ConfigPreprocess.PreprocessPara ?? {}
          this.openDialogPreprocess = true
          break;
        case "augmentation-node":
          this.dialogExperimentId = this.graph.experimentId
          this.dialogAugmentationPara = this.graph.experiment.ConfigAugmentation.AugmentationPara ?? {}
          this.openDialogAugmentation = true
          break;
        case "model-select-node":
          this.dialogExperimentId = this.graph.experimentId
          this.setDefaultSelectModelPara()
          this.openDialogModelSelect = true
          break;
        default:
          Logger.log("out of case")
      }
    });
  }

  private async setDatasetPara(path: string): Promise<void> {

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

    this.openDialogDataset = false;
  }


  private async setPreprocessPara(newPara: PreprocessPara): Promise<void> {

    if (!this.graph.experiment) return
    this.graph.experiment.ConfigPreprocess.PreprocessPara = newPara

    await Api.setExperiments(this.graph.projectName, this.graph.experimentId, this.graph.experiment)
    this.openDialogPreprocess = false

    this.drawGraph()
  }

  private async setAugmentationPara(newPara: AugmentationPara): Promise<void> {

    if (!this.graph.experiment) return
    this.graph.experiment.ConfigAugmentation.AugmentationPara = newPara
    await Api.setExperiments(this.graph.projectName, this.graph.experimentId, this.graph.experiment)
    this.openDialogAugmentation = false

    this.drawGraph()
  }

  private setDefaultSelectModelPara() {
    if (!this.graph.experiment) return
    if (!store.experimentConfigs) return
    this.dialogModelSelectPara.modelStructure =
      this.graph.experiment.ConfigPytorchModel.SelectedModel.model.structure ??
      store.experimentConfigs.ConfigPytorchModel.SelectedModel.model.structure.default as string
    this.dialogModelSelectPara.modelPretrained =
      this.graph.experiment.ConfigPytorchModel.SelectedModel.model.pretrained ??
      store.experimentConfigs.ConfigPytorchModel.SelectedModel.model.pretrained.default as boolean

    if (this.dialogModelSelectPara.modelPretrained) this.dialogModelSelectPara.modelPretrained = true

    this.dialogModelSelectPara.batchSize =
      this.graph.experiment.ConfigPytorchModel.ClsModelPara.batchSize ??
      store.experimentConfigs.ConfigPytorchModel.ClsModelPara.batchSize.default as number
    this.dialogModelSelectPara.epochs =
      this.graph.experiment.ConfigPytorchModel.ClsModelPara?.epochs ??
      store.experimentConfigs.ConfigPytorchModel.ClsModelPara.epochs.default as number
    this.dialogModelSelectPara.lossFunction =
      this.graph.experiment.ConfigModelService.LossFunctionPara.lossFunction ??
      store.experimentConfigs.ConfigModelService.LossFunctionPara.lossFunction.default as string

    this.dialogModelSelectPara.optimizer =
      Object.keys(this.graph.experiment.ConfigModelService.OptimizerPara)[0] ??
      Object.keys(store.experimentConfigs.ConfigModelService.OptimizerPara)[0]

    this.dialogModelSelectPara.scheduler =
      Object.keys(this.graph.experiment.ConfigModelService.SchedulerPara)[0] ??
      Object.keys(store.experimentConfigs.ConfigModelService.SchedulerPara)[0]
  }

  private async setModelSelectPara(newPara: ModelSelectPara): Promise<void> {

    if (!this.graph.experiment) return

    this.graph.experiment.ConfigPytorchModel = {
      SelectedModel: {
        model: {
          structure: newPara.modelStructure,
          pretrained: newPara.modelPretrained,
        }
      },
      ClsModelPara: {
        batchSize: newPara.batchSize,
        epochs: newPara.epochs,
      }
    }

    this.graph.experiment.ConfigModelService = {
      ...this.graph.experiment.ConfigModelService,
      LossFunctionPara: { lossFunction: newPara.lossFunction },
    }

    if (!store.experimentConfigs) return

    const SchedulerParaConfig = new Map<string, Map<string, ConfigType>>(Object.entries(store.experimentConfigs.ConfigModelService.SchedulerPara))
    const schedulerConfig = new Map<string, ConfigType>(Object.entries(SchedulerParaConfig.get(newPara.scheduler) ?? {}))


    let schedulerBasic: { name: string, default: number | string | boolean }[] = []
    schedulerConfig.forEach((arg, name) => {
      if (name === 'tMax') {
        schedulerBasic = [...schedulerBasic, { name: name, default: newPara.epochs }]
      } else {
        schedulerBasic = [...schedulerBasic, { name: name, default: arg.default }]
      }
    })

    const scheduler: SchedulerPara = JSON.parse(JSON.stringify(store.experimentConfigs.ConfigModelService.SchedulerPara))[newPara.scheduler]

    schedulerBasic.forEach(item => scheduler[item.name] = item.default)

    this.graph.experiment.ConfigModelService = {
      ...this.graph.experiment.ConfigModelService,
      SchedulerPara: {
        [newPara.scheduler]: { ...scheduler, switch: 1 }
      }
    }


    const OptimizerParaConfig = new Map<string, Map<string, ConfigType>>(Object.entries(store.experimentConfigs.ConfigModelService.OptimizerPara))
    const optimizerConfig = new Map<string, ConfigType>(Object.entries(OptimizerParaConfig.get(newPara.optimizer) ?? {}))

    let optimizerBasic: { name: string, default: number | string | boolean }[] = []
    optimizerConfig.forEach((arg, name) => { optimizerBasic = [...optimizerBasic, { name: name, default: arg.default }] })

    const optimizer: OptimizerPara = JSON.parse(JSON.stringify(store.experimentConfigs.ConfigModelService.OptimizerPara))[newPara.optimizer]
    optimizerBasic.forEach(item => optimizer[item.name] = item.default)

    this.graph.experiment.ConfigModelService = {
      ...this.graph.experiment.ConfigModelService,
      OptimizerPara: {
        [newPara.optimizer]: { ...optimizer, switch: 1 }
      }
    }

    await Api.setExperiments(this.graph.projectName, this.graph.experimentId, this.graph.experiment)

    this.openDialogModelSelect = false
    this.drawGraph()

  }


  private async runExperimentTrain(): Promise<void> {

    if (!this.graph.experiment) return

    const datasetPath = this.graph.experiment.Config.PrivateSetting.datasetPath
    if (!datasetPath) {
      const h = this.$createElement;
      this.$message({
        type: 'warning',
        message: h('h3', { style: 'color:#E6A23C;' }, "請先設定資料夾路徑"),
      })
      return
    }

    const datasetStatus = store.projectList.get(this.graph.projectName)?.datasets?.get(datasetPath)
    if (!datasetStatus) return
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

  private solutionKey(): string {

    if (!this.graph.experiment) return ''

    let experiment: Experiment = new Experiment()

    experiment = JSON.parse(JSON.stringify(this.graph.experiment))

    if (experiment.Config !== undefined) experiment.Config.PrivateSetting.datasetPath = ""

    return StringUtil.encodeObject(experiment)

  }

}