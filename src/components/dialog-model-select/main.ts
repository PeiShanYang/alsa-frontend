import { ConfigType } from '@/io/experimentConfig';
import Api from '@/services/api.service';
import store from '@/services/store.service';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component
export default class DialogModelSelect extends Vue {
  @Prop() private dialogOpen!: boolean;

  @Emit("dialog-close")
  closeDialogModelSelect(): void {
    return
  }

  private configs = {
    model: { structure: new ConfigType, pretrained: new ConfigType, },
    ClsModelPara: { batchSize: new ConfigType, epoches: new ConfigType, }
  }

  private models: string[] = [];
  private changeToSetting = false;
  private targetModel = ''
  private resizeCheck = []

  private modelSetting = ['pretrained','batchSize','epochs','Optimizer','Scheduler']

  mounted(): void {
    this.waitConfigsSetting()
  }

  private async waitConfigsSetting(): Promise<void> {
    if (!store.experimentConfigs) await Api.getExperimentConfigs()

    if (store.experimentConfigs) this.configs = store.experimentConfigs.ConfigPytorchModel.SelectedModel

    if (!this.configs.model.structure.enums) return
    console.log("this.configs", this.configs)

    this.models = Object.entries(this.configs.model.structure.enums).map(item => this.optionName(item[0]))

  }

  private optionName(name: string): string {
    return this.$i18n.t(name).toString();
  }

  private handleSelectModel(modelName: string): void {
    this.targetModel = modelName
    this.changeToSetting = true
  }


}