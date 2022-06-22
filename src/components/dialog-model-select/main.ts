import { ConfigType } from '@/io/experimentConfig';
import Api from '@/services/api.service';
import store from '@/services/store.service';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import OptionForm from '@/components/options/option-form/OptionForm.vue';
import { ModelSelectPara } from '@/io/experiment';

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
  closeDialogModelSelect(save: boolean): ModelSelectPara {
    if (save) return this.newPara
    return this.default
  }

  private init = false

  private modelStructure = 'auo_unrestricted_powerful_model'
  private modelPretrained = false
  private batchSize = 1
  private epochs = 1
  private lossFunction = 'CrossEntropyLoss'
  private optimizer = 'SGD'
  private scheduler = ''

  private models: string[] = [];

  private modelSetting = ['pretrained', 'batchSize', 'epochs', 'lossFunction', 'Optimizer', 'Scheduler']
  private changeToSetting = false

  mounted(): void {
    this.waitConfigsSetting()
  }

  updated(): void {
    if (!this.init) {
      this.newPara = this.default
      this.init = true
    }
  }

  private async waitConfigsSetting(): Promise<void> {
    if (!store.experimentConfigs) await Api.getExperimentConfigs()

    const modelConfig = new Map<string, ConfigType>(Object.entries(store.experimentConfigs?.ConfigPytorchModel.SelectedModel.model ?? {}))
    this.models = Object.keys(modelConfig.get('structure')?.enums ?? {})
    this.modelStructure = modelConfig.get('structure')?.default.toString() ?? ''
  }

  private optionName(name: string): string {
    return this.$i18n.t(name).toString();
  }

  private handleSelectModel(modelName: string): void {
    this.modelStructure = modelName
    this.changeToSetting = true
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
}