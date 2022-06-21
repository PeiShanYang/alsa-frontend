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
  closeDialogModelSelect(): void {
    return
  }


  private models: string[] = [];
  private pickedModel = '';
  private changeToSetting = false;
  private targetModel = ''
  private resizeCheck = []

  private modelSetting = ['pretrained','batchSize','epochs','Optimizer','Scheduler']

  mounted(): void {
    this.waitConfigsSetting()
  }

  updated():void{
    this.newPara = this.default
    console.log("default",this.newPara)
  }

  private async waitConfigsSetting(): Promise<void> {
    if (!store.experimentConfigs) await Api.getExperimentConfigs()

    if(store.experimentConfigs){
      
      console.log("test", new Map<string, ConfigType>(Object.entries(store.experimentConfigs.ConfigPytorchModel.SelectedModel.model)))
    }

    // if (store.experimentConfigs) this.configs = store.experimentConfigs.ConfigPytorchModel.SelectedModel

    // if (!this.configs.model.structure.enums) return
    // // console.log("this.configs", this.configs)

    // this.models = Object.entries(this.configs.model.structure.enums).map(item => this.optionName(item[0]))

    console.log("this.configs", store.experimentConfigs)

    

  }

  private defaultFromConfig(config: Map<string, ConfigType>, defaultValue: Dict): Dict {
    if (defaultValue !== undefined) return defaultValue
    config = new Map<string, ConfigType>(Object.entries(config))
    const newPara = new Map<string, boolean | number | number[] | string | string[]>()
    config.forEach((arg, name) => {
      if (arg.type == 'list') {
        if (arg.children !== undefined) {
          const children = new Map<string, ConfigType>(Object.entries(arg.children))
          if (Array.from(children.values())[0].type == 'string') {
            const l: string[] = []
            children.forEach((v) => l.push(v.default as string))
            newPara.set(name, l)
          } else {
            const l: number[] = []
            children.forEach((v) => l.push(v.default as number))
            newPara.set(name, l)
          }
        }
      } else {
        newPara.set(name, arg.default)
      }
    })
    return newPara
  }

  private optionName(name: string): string {
    return this.$i18n.t(name).toString();
  }

  private handleSelectModel(modelName: string): void {
    this.targetModel = modelName
    this.changeToSetting = true
  }


}