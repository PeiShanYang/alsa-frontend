import { ConfigType } from '@/io/experimentConfig';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import OptionIntSliderForm from '@/components/options/option-int-slider-form/OptionIntSliderForm.vue';
import OptionFloatSliderForm from '@/components/options/option-float-slider-form/OptionFloatSliderForm.vue';
import OptionIntInputForm from '@/components/options/option-int-input-form/OptionIntInputForm.vue';
import OptionEnumsForm from '@/components/options/option-enums-form/OptionEnumsForm.vue';

@Component({
  components: {
    OptionIntSliderForm,
    OptionFloatSliderForm,
    OptionIntInputForm,
    OptionEnumsForm,
  }
})
export default class OptionForm extends Vue {
  @Prop() private config!: Map<string, ConfigType>
  @Prop() private default!: Map<string, number | number[] | string | string[]>

  private newPara = this.default

  updated(): void {
    this.returnPara()
  }

  @Emit("change")
  returnPara(): Map<string, number | number[] | string | string[]> {
    return this.newPara
  }

  private tr(str: string): string {
    return this.$i18n.t(str).toString()
  }

  private bounded(arg: ConfigType): boolean {
    return arg.min !== undefined && arg.max != undefined
  }

  private formType(arg: ConfigType): string {
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
    return ''
  }

}