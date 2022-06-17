import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component
export default class OptionFloatInputForm extends Vue {
  @Prop() private max?: number
  @Prop() private min?: number
  @Prop() private unit?: string
  @Prop() private value!: number

  private v = this.value.toString()

  @Emit("input")
  private onInputChange(): number {
    return parseFloat(this.v)
  }
}