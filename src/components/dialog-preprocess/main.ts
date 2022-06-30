import { ConfigType } from '@/io/experimentConfig';
import Api from '@/services/api.service';
import store from '@/services/store.service';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import OptionForm from '@/components/options/option-form/OptionForm.vue';
import { PreprocessPara } from '@/io/experiment';

type Dict = Map<string, number | number[] | string | string[] | boolean>

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
  private configs = new Map<string, Map<string, ConfigType>>()
  private optionSelect: { [k: string]: any } = {};
  private init = false;

  private currentPage = 1
  private pageSize = 8
  private configCount = 0
  private configSlice: { [k: string]: any } = {};

  @Emit("dialog-close")
  closeDialogPreprocess(): void {
    return
  }

  @Emit("set-para")
  setPara(): PreprocessPara {
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

    if (store.experimentConfigs) this.configs = store.experimentConfigs.ConfigPreprocess.PreprocessPara

    Object.keys(this.configs).forEach(item => this.optionSelect[item] = false)

    this.handlePageChange()



  }

  private defaultFromConfig(config: Map<string, ConfigType>, name: string): Dict {

    if (this.newPara[name] !== undefined) {
      return new Map<string, number | number[] | string | string[] | boolean>(Object.entries(this.newPara[name]))
    }

    if (this.default[name] !== undefined) {
      return new Map<string, number | number[] | string | string[] | boolean>(Object.entries(this.default[name]))
    }

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
    const collapseBody = document.querySelector<HTMLElement>(`#${name}_collapse .collapse-body`) ?? new HTMLDivElement()
    const collapseHeader = document.querySelector<HTMLElement>(`#${name}_collapse .collapse-header`) ?? new HTMLDivElement()
    const collapseArrow = document.querySelector<HTMLElement>(`#${name}_collapse .collapse-header .collapse-header-arrow i`) ?? new HTMLDivElement()

    if (enable) {
      if (Object.prototype.toString.call(targetDefault) === '[object Map]') this.newPara[name] = Object.fromEntries(targetDefault) ?? {}

      collapseBody.style.maxHeight = collapseBody.scrollHeight + 'px'
      collapseHeader.style.background = '#0E5879'
      collapseArrow.classList.add('active')

    } else {
      if (this.newPara[name] !== undefined) delete this.newPara[name]

      collapseBody.style.maxHeight = '0px'
      collapseHeader.style.background = '#4A9ABE'
      collapseArrow.classList.remove('active')
    }

  }

  private toggleCollapse(name: string): void {
    const collapseArrow = document.querySelector<HTMLElement>(`#${name}_collapse .collapse-header .collapse-header-arrow i`) ?? new HTMLDivElement()
    const collapseBody = document.querySelector<HTMLElement>(`#${name}_collapse .collapse-body`) ?? new HTMLDivElement()
    collapseBody.style.maxHeight = collapseArrow.classList.toggle('active') ? collapseBody.scrollHeight + 'px' : '0px'

  }


  private updateOption(name: string, event: Map<string, number | number[] | string | string[]>) {
    this.newPara[name] = Object.fromEntries(event)

  }

  private optionCase(name: string): string | undefined {
    if (name == 'normalize') return 'normal'
  }

  private handlePageChange(): void {

    this.configCount = Object.entries(this.configs).length
    const getSlice = Object.entries(this.configs).slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)

    this.configSlice = Object.fromEntries([...getSlice])
  }


}