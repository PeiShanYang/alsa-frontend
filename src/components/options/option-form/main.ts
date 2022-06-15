import { ConfigType } from '@/io/experimentConfig';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import OptionIntSliderForm from '@/components/options/option-int-slider-form/OptionIntSliderForm.vue';
import OptionFloatSliderForm from '@/components/options/option-float-slider-form/OptionFloatSliderForm.vue';

@Component({
  components: {
    OptionIntSliderForm,
    OptionFloatSliderForm,
  }
})
export default class OptionForm extends Vue {
  @Prop() private config!: Map<string, ConfigType>
  @Prop() private default!: Map<string, number | number[] | string | string[]>

  private newPara = this.default

  // updated(): void {
  //   this.returnPara()
  // }

  // @Emit("change")
  // returnPara(): Dict {
  //   return this.newPara
  // }

  mounted(): void {
    console.log(this.default)
    console.log('data', this.newPara)
  }

  private tr(str: string): string {
    return this.$i18n.t(str).toString()
  }

  private bounded(arg: ConfigType): boolean {
    return arg.min !== undefined && arg.max != undefined
  }

  private formType(arg: ConfigType): string {
    if (arg.type === 'int' && this.bounded(arg)) {
      return 'int-slider'
    }
    else if (arg.type === 'float' && this.bounded(arg)) {
      return 'float-slider'
    }
    return ''
  }

}