import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component
export default class OptionFloatInputForm extends Vue {
  @Prop() private max?: number
  @Prop() private min?: number
  @Prop() private unit?: string
  @Prop() private value!: number

  private v = this.value.toString()

  @Emit("input")
  private onInputChange(inputValue: string): number {

    this.v = inputValue

    if (this.v === '') return this.min ?? 0

    if(isNaN(parseFloat(inputValue))) this.v = ""

    let value = isNaN(parseFloat(this.v)) ? 0 : parseFloat(this.v)

    if (this.max !== undefined && value > this.max) {
      this.v = this.max.toString()
      value = this.max
    }
    if (this.min !== undefined && value < this.min) {
      this.v = this.min.toString()
      value = this.min
    }

    return value
  }

}