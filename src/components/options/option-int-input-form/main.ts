import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component
export default class OptionIntInputForm extends Vue {
  @Prop() private max?: number
  @Prop() private min?: number
  @Prop() private unit?: string
  @Prop() private value!: number

  private v = this.value.toString()

  @Emit("input")
  private onInputChange(): number {
    return parseInt(this.v)
  }
}