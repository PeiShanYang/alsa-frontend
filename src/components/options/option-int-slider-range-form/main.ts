import { Component, Emit, Prop, Vue,Watch } from 'vue-property-decorator';

@Component
export default class OptionIntSliderRangeForm extends Vue {
  @Prop() private max!: number
  @Prop() private min!: number
  @Prop() private boundValue!: number[]

  private lowerbound = this.boundValue[0]
  private upperbound = this.boundValue[1]

  @Watch('lowerbound')
  handleLowerboundChange() {
    if (this.lowerbound > this.upperbound) this.upperbound = this.lowerbound
  }

  @Watch('upperbound')
  handleUpperboundChange() {
    if (this.lowerbound > this.upperbound) this.lowerbound = this.upperbound
  }

  updated(): void {
    this.onInputChange()
  }

  @Emit("input")
  private onInputChange(): number[] {
    return [this.lowerbound, this.upperbound]
  }
}