import { ConfigType } from '@/io/experimentConfig';
import Api from '@/services/api.service';
import store from '@/services/store.service';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import OptionForm from '@/components/options/option-form/OptionForm.vue';
import { ModelSelectPara } from '@/io/experiment';
import { GetModelDescriptionResData } from '@/io/rest/getModelDescription';

type Dict = Map<string, boolean | number | number[] | string | string[]>

@Component({
  components: {
    OptionForm
  }
})

export default class DialogModelSelect extends Vue {
  @Prop() private dialogOpen!: boolean;
  @Prop() private experimentId!: string;
  @Prop() private default!: ModelSelectPara;

  private newPara: ModelSelectPara = this.default
  private configs = new Map<string, Map<string, ConfigType>>()

  @Emit("dialog-close")
  closeDialogModelSelect(): void {
    return
  }

  @Emit("set-para")
  setPara(): ModelSelectPara {
    return this.newPara
  }

  private init = false

  private modelStructure = 'auo_unrestricted_powerful_model'
  private modelPretrained = false
  private batchSize = 1
  private epochs = 1
  private lossFunction = 'CrossEntropyLoss'
  private optimizer = 'SGD'
  private scheduler = ''


  private modelsDescription: Map<string, GetModelDescriptionResData> = new Map<string, GetModelDescriptionResData>()
  private models: Map<string, GetModelDescriptionResData> = new Map<string, GetModelDescriptionResData>()

  private modelSetting = ['pretrained', 'batchSize', 'epochs', 'lossFunction', 'Optimizer', 'Scheduler']
  private changeToSetting = false

  private currentPage = 1
  private pageSize = 8
  private modelCount = 0

  mounted(): void {
    this.waitConfigsSetting()
  }

  updated(): void {
    if (!this.init) {
      this.newPara = this.default
      this.init = true
    }
    this.modelStructure = this.default.modelStructure

  }

  private async waitConfigsSetting(): Promise<void> {
    if (!store.experimentConfigs) await Api.getExperimentConfigs()

    this.modelsDescription = await Api.getModelDescription()
    this.handlePageChange()



  }

  private optionName(name: string): string {
    return this.$i18n.t(name).toString();
  }

  private pickModelSetting(modelName: string, advance: boolean): void {
    this.modelStructure = modelName
    this.newPara.modelStructure = modelName
    if (advance) this.changeToSetting = true
  }


  private saveChanges(): void {
    this.newPara.modelStructure = this.modelStructure
    this.newPara.modelPretrained = this.modelPretrained
    this.newPara.batchSize = this.batchSize
    this.newPara.epochs = this.epochs
    this.newPara.lossFunction = this.lossFunction
    this.newPara.optimizer = this.optimizer
    this.newPara.scheduler = this.scheduler

    this.changeToSetting = false
  }

  private handlePageChange(): void {
    const modelConfig = new Map<string, ConfigType>(Object.entries(store.experimentConfigs?.ConfigPytorchModel.SelectedModel.model ?? {}))
    const allModels = Object.keys(modelConfig.get('structure')?.enums ?? {})
    this.modelCount = allModels.length

    const currentModels = allModels.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    this.models = new Map<string, GetModelDescriptionResData>()

    currentModels.forEach(modelName => {
      const description = this.modelsDescription.get(modelName)
      if (description) this.models.set(modelName, description)
    })
  }
}