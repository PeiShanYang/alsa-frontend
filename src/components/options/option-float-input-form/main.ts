import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component
export default class OptionFloatInputForm extends Vue {
  @Prop() private max?: number
  @Prop() private min?: number
  @Prop() private unit?: string
  @Prop() private value!: number

  private v = this.value.toString()

  updated():void{
    this.onInputChange()
  }

  @Emit("input")
  private onInputChange(): number {

    if(this.v === '') return this.min ?? 0

    const value = parseFloat(this.v)
    if(this.max && value > this.max) return this.max
    if(this.min && value < this.min) return this.min

    return value

  }
}