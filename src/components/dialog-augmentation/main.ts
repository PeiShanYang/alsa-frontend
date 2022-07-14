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
  private configs = new Map<string, Map<string, ConfigType | string>>()
  private optionSelect: { [k: string]: any } = {};
  private init = false;

  private currentPage = 1
  private pageSize = 8
  private configCount = 0
  private configSlice: { [k: string]: any } = {};


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

    if (!this.init && Object.keys(this.default).length !== 0) {
      this.newPara = this.default
      this.init = true
    }

    Object.keys(this.optionSelect).forEach(item => {
      if (Object.keys(this.newPara).includes(item)) {
        this.optionSelect[item] = true
        if (document.querySelector<HTMLElement>(`#${item}_collapse .collapse-header`) !== null) {
          const collapseHeader = document.querySelector<HTMLElement>(`#${item}_collapse .collapse-header`) ?? new HTMLDivElement()
          collapseHeader.style.background = '#0E5879'
        }
      }
    })
  }

  private async waitConfigsSetting(): Promise<void> {
    if (!store.experimentConfigs) await Api.getExperimentConfigs()

    if (store.experimentConfigs) {
      this.configs = new Map<string, Map<string, ConfigType | string>>(Object.entries(store.experimentConfigs.ConfigAugmentation.AugmentationPara))
    } 

    this.configs.forEach((val, name) => this.optionSelect[name] = false)

    this.handlePageChange()
  }


  private defaultFromConfig(config: Map<string, ConfigType | string>, name: string): Dict {

    if(this.newPara[name] !== undefined){
      return new Map<string, number | number[] | string | string[] | boolean>(Object.entries(this.newPara[name]))
    }

    if(this.default[name] !== undefined){
      return new Map<string, number | number[] | string | string[] | boolean>(Object.entries(this.default[name]))
    }

    config = new Map<string, ConfigType>(Object.entries(config))
    const newPara = new Map<string, number | number[] | string | string[] | boolean>()
    newPara.set('switch', 1)
    config.forEach((arg, name) => {
      if (typeof arg === "string") return
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

    const targetConfig = this.configs.get(name) ?? new Map<string, ConfigType | string>()
    const targetDefault = this.defaultFromConfig(targetConfig, this.newPara[name])
    const collapseBody = document.querySelector<HTMLElement>(`#${name}_collapse .collapse-body`) ?? new HTMLDivElement()
    const collapseHeader = document.querySelector<HTMLElement>(`#${name}_collapse .collapse-header`) ?? new HTMLDivElement()
    const collapseArrow = document.querySelector<HTMLElement>(`#${name}_collapse .collapse-header .collapse-header-arrow i`) ?? new HTMLDivElement()

    if (enable) {
      if (Object.prototype.toString.call(targetDefault) === '[object Map]') this.newPara[name] = Object.fromEntries(targetDefault) ?? {}

      collapseBody.style.height = 'fit-content'
      collapseHeader.style.background = '#0E5879'
      collapseArrow.classList.add('active')

    } else {
      if (this.newPara[name] !== undefined) delete this.newPara[name]
      // collapseBody.style.height = '0px'
      collapseHeader.style.background = '#4A9ABE'
      // collapseArrow.classList.remove('active')
    }

  }

  private toggleCollapse(name: string): void {
    const collapseArrow = document.querySelector<HTMLElement>(`#${name}_collapse .collapse-header .collapse-header-arrow i`) ?? new HTMLDivElement()
    const collapseBody = document.querySelector<HTMLElement>(`#${name}_collapse .collapse-body`) ?? new HTMLDivElement()
    collapseBody.style.height = collapseArrow.classList.toggle('active') ? 'fit-content' : '0px'

  }

  private updateOption(name: string, event: Map<string, number | number[] | string | string[]>) {
    this.newPara[name] = Object.fromEntries(event)

  }

  private optionCase(name: string): string | undefined {
    if (name == 'normalize') return 'normal'
  }

  private handlePageChange(): void {
    this.configCount = this.configs.size
    const getSlice = [...this.configs].slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)

    this.configSlice = Object.fromEntries([...getSlice])
  }
}