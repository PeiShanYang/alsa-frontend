import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component
export default class OptionIntInputForm extends Vue {
  @Prop() private max?: number
  @Prop() private min?: number
  @Prop() private unit?: string
  @Prop() private value!: number

  private v = this.value.toString()

  @Emit("input")
  private onInputChange(inputValue: string): number {

    this.v = inputValue

    if (this.v === '') return this.min ?? 0

    if(isNaN(parseInt(inputValue))) this.v = ""

    let value = isNaN(parseInt(this.v)) ? 0 : parseInt(this.v)

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