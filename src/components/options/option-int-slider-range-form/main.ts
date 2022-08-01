import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component
export default class OptionIntSliderRangeForm extends Vue {
  @Prop() private max!: number
  @Prop() private min!: number
  @Prop() private boundValue!: number[]

  private v = this.boundValue

  updated(): void {

    if (this.v[0] > this.v[1]) this.v = [this.v[0], this.v[0]]

    this.onInputChange()
  }

  @Emit("input")
  private onInputChange(): number[] {
    return this.v
  }
}