import { ConfigType } from '@/io/experimentConfig';
import Api from '@/services/api.service';
import store from '@/services/store.service';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import OptionForm from '@/components/options/option-form/OptionForm.vue';
import { PreprocessPara } from '@/io/experiment';
import { stringToArray } from 'konva/lib/shapes/Text';

type Dict = Map<string, number | number[] | string | string[]>

@Component({
  components: {
    OptionForm
  }
})
export default class DialogPreprocess extends Vue {
  @Prop() private dialogOpen!: boolean
  @Prop() private experimentId!: string
  @Prop() private default!: PreprocessPara

  private newPara: PreprocessPara = this.default

  @Emit("dialog-close")
  closeDialogPreprocess(): void {
    return
  }

  private configs = new Map<string, Map<string, ConfigType>>()
  // private resizeCheck = []
  // private colorPick = 'rgb(255,255,255,1)';

  mounted(): void {
    this.waitConfigsSetting()
  }

  private async waitConfigsSetting(): Promise<void> {
    if (!store.experimentConfigs) await Api.getExperimentConfigs()

    if (store.experimentConfigs) this.configs = store.experimentConfigs.ConfigPreprocess.PreprocessPara

    console.log("this.configs", this.configs)
  }

  private defaultFromConfig(config: Map<string, ConfigType>, defaultValue: Dict): Dict {
    if (defaultValue !== undefined) return defaultValue
    config = new Map<string, ConfigType>(Object.entries(config))
    const newPara = new Map<string, number | number[] | string | string[]>()
    config.forEach((arg, name) => {
      if (arg.type == 'list') {
        const l: number[] = []
        if (arg.children !== undefined) {
          new Map<string, ConfigType>(Object.entries(arg.children)).forEach((v) => l.push(v.default))
        }
        newPara.set(name, l)
      } else if (arg.type == 'dict') {
        const d = new Map<string, number | string>()
        if (arg.children !== undefined) {
          new Map<string, ConfigType>(Object.entries(arg.children)).forEach((v, k) => d.set(k, v.default))
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

  private activeOption(name: string): string[] {
    if (this.newPara[name] !== undefined) return ["1"]
    return []
  }

  private updateOption(name: string, event: {target: {value: Map<string, number | number[] | string | string[]>}}) {
    this.newPara[name] = event.target.value
  }

  // private optionEnabled(name: string): boolean {
  //   return this.newPara[name] !== undefined
  // }

  // private toggleOption(name: string): void {
  //   if (this.newPara[name] !== undefined) {
  //     this.newPara[name] = undefined
  //   }
  //   else {
  //     this.newPara[name] = {
  //       switch: 1
  //     }
  //   }
  // }
}