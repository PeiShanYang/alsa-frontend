import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class OptionEnumsForm extends Vue {
  @Prop() private enums!: Map<string, string | number>
  @Prop() private value!: string | number

  private v = this.value

  private displayName(name: string): string {
    return this.$i18n.t(name).toString()
  }

  updated():void{
    this.onInputChange()
  }

  @Emit("input")
  private onInputChange(): string | number {
    return this.v
  }
}