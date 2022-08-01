import { ConfigType } from '@/io/experimentConfig';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import OptionIntSliderForm from '@/components/options/option-int-slider-form/OptionIntSliderForm.vue';
import OptionFloatSliderForm from '@/components/options/option-float-slider-form/OptionFloatSliderForm.vue';
import OptionIntInputForm from '@/components/options/option-int-input-form/OptionIntInputForm.vue';
import OptionFloatInputForm from '@/components/options/option-float-input-form/OptionFloatInputForm.vue';
import OptionEnumsForm from '@/components/options/option-enums-form/OptionEnumsForm.vue';
import OptionFloatSliderRangeForm from '@/components/options/option-float-slider-range-form/OptionFloatSliderRangeForm.vue';
import OptionIntSliderRangeForm from '@/components/options/option-int-slider-range-form/OptionIntSliderRangeForm.vue';

@Component({
  components: {
    OptionIntSliderForm,
    OptionFloatSliderForm,
    OptionIntInputForm,
    OptionFloatInputForm,
    OptionEnumsForm,
    OptionFloatSliderRangeForm,
    OptionIntSliderRangeForm,
  }
})
export default class OptionForm extends Vue {
  @Prop() private config!: Map<string, ConfigType>
  @Prop() private default!: Map<string, number | number[] | string | string[]>
  @Prop() private case?: string

  private newPara = this.default

  updated(): void {
    this.returnPara()
  }

  @Emit("change")
  returnPara(): Map<string, number | number[] | string | string[]> {
    return this.newPara
  }

  private tr(str: string, arg: ConfigType): string {
    if (arg.display !== undefined) return this.$i18n.t(arg.display).toString()
    return this.$i18n.t(str).toString()
  }

  private bounded(arg: ConfigType): boolean {
    return arg.min !== undefined && arg.max != undefined
  }

  private formTypeSpecialCase(arg: ConfigType): string {

    if (this.case === 'normal') {
      if (arg.enums !== undefined) {
        return 'enums'
      }
      if (this.newPara.get('mode') == 'UserInput') {
        return 'continue' // not rigorous, but there is only list
      }
    }
    return ''
  }

  private formType(arg: ConfigType): string {
    if (this.case !== undefined) {
      const formType = this.formTypeSpecialCase(arg)
      if (formType !== 'continue') return formType
    }

    if (arg.enums !== undefined) {
      return 'enums'
    }
    if (arg.type === 'int' && this.bounded(arg)) {
      return 'int-slider'
    }
    else if (arg.type === 'float' && this.bounded(arg)) {
      return 'float-slider'
    }
    else if (arg.type === 'int') {
      return 'int-input'
    }
    else if (arg.type === 'float') {
      return 'float-input'
    }
    else if (arg.type === 'list') {
      return 'list'
    }
    return ''
  }

  private childValue(name: string, index: number): string | number | undefined {

    const childPara = this.newPara.get(name)

    if (Array.isArray(childPara)) return childPara[index]

    return childPara
  }

  private setChildValue(name: string, index: number, value: number | string | number[]): void {

    const childPara = this.newPara.get(name)

    if (Array.isArray(childPara)) {

      if (Array.isArray(value)) {
        childPara[index] = value[0]
        childPara[index + 1] = value[1]
      } else {
        childPara[index] = value
      }
      this.newPara.set(name, childPara)
      this.$forceUpdate()
    } else {
      this.newPara.set(name, value)
      this.$forceUpdate()
    }

  }

  private updateNewPara(name: string, value: string | number): void {
    this.newPara.set(name, value)
    this.$forceUpdate()
  }

}