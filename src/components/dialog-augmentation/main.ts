import { ConfigType } from '@/io/experimentConfig';
import Api from '@/services/api.service';
import store from '@/services/store.service';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import OptionForm from '@/components/options/option-form/OptionForm.vue';
import { AugmentationPara } from '@/io/experiment';

type Dict = Map<string, number | number[] | string | string[]>

@Component({
  components: {
    OptionForm
  }
})

export default class DialogAugmentation extends Vue {
  @Prop() private dialogOpen!: boolean
  @Prop() private experimentId!: string
  @Prop() private default!: AugmentationPara

  private newPara: AugmentationPara = this.default
  private configs = new Map<string, Map<string, ConfigType>>()


  @Emit("dialog-close")
  closeDialogAugmentation(): void {
    return
  }

  @Emit("set-para")
  setPara(): AugmentationPara {
    return this.newPara
  }

  mounted(): void {
    this.waitConfigsSetting()
  }

  updated(): void {
    this.newPara = this.default
  }

  private async waitConfigsSetting(): Promise<void> {
    if (!store.experimentConfigs) await Api.getExperimentConfigs()

    if (store.experimentConfigs) this.configs = store.experimentConfigs.ConfigAugmentation.AugmentationPara
    console.log("tee",Object.entries(this.configs))

  }


  private defaultFromConfig(config: Map<string, ConfigType>, defaultValue: Dict): Dict {
    if (defaultValue !== undefined) return defaultValue
    config = new Map<string, ConfigType>(Object.entries(config))
    const newPara = new Map<string, number | number[] | string | string[]>()
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

  private activeOption(name: string): string[] {
    if (this.newPara[name] !== undefined) return ["1"]
    return []
  }

  private updateOption(name: string, event: Map<string, number | number[] | string | string[]>) {
    this.newPara[name] = event
  }
 


}