import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component
export default class OptionIntSliderForm extends Vue {
  @Prop() private max!: number
  @Prop() private min!: number
  @Prop() private value!: number

  private v = this.value
  private strValue = this.value.toString()

  updated(): void {
    this.strValue = this.v.toString()
  }

  @Emit("input")
  private onInputChange(): number {
    return this.v
  }

  private updateValue(value: string) {
    this.v = parseFloat(value)
  }
}