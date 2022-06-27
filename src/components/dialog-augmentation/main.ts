import { ConfigType } from '@/io/experimentConfig';
import Api from '@/services/api.service';
import store from '@/services/store.service';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import OptionForm from '@/components/options/option-form/OptionForm.vue';
import { AugmentationPara } from '@/io/experiment';

type Dict = Map<string, number | number[] | string | string[] | boolean>

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
  private optionSelect: { [k: string]: any } = {};
  private init = false;


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

    if (Object.keys(this.default).length > 0 && this.init === false) {
      Object.keys(this.optionSelect).forEach(item => {
        if (Object.keys(this.default).includes(item)) {
          this.optionSelect[item] = true
        }
      })
      this.init = true
    }
  }

  private async waitConfigsSetting(): Promise<void> {
    if (!store.experimentConfigs) await Api.getExperimentConfigs()

    if (store.experimentConfigs) this.configs = store.experimentConfigs.ConfigAugmentation.AugmentationPara
    Object.keys(this.configs).forEach(item => this.optionSelect[item] = false)

  }


  private defaultFromConfig(config: Map<string, ConfigType>, defaultValue: Dict): Dict {
    if (defaultValue !== undefined) return defaultValue
    config = new Map<string, ConfigType>(Object.entries(config))
    const newPara = new Map<string, number | number[] | string | string[] | boolean>()
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

  private activeOption(enable: boolean, name: string): void {

    this.optionSelect = {
      ...this.optionSelect,
      name: enable
    }

    const config = new Map<string, Map<string, ConfigType>>(Object.entries(this.configs))
    const targetConfig = config.get(name) ?? new Map<string, ConfigType>()
    const targetDefault = this.defaultFromConfig(targetConfig, this.newPara[name])

    if (enable && Object.prototype.toString.call( targetDefault) === '[object Map]') this.newPara[name] = Object.fromEntries(targetDefault) ?? {}

  }

  private updateOption(name: string, event: Map<string, number | number[] | string | string[]>) {
    this.newPara[name] = event
  }

  private optionCase(name: string): string | undefined {
    if (name == 'normalize') return 'normal'
  }
}