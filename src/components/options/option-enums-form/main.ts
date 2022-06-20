import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class OptionEnumsForm extends Vue {
  @Prop() private enums!: Map<string, string | number>
  @Prop() private value!: string | number

  private valueName = this.getKeyName

  private get enumsMap(): Map<string, string | number> {
    return new Map<string, string | number>(Object.entries(this.enums))
  }

  private get getKeyName(): string {
    for (const key in this.enumsMap.keys()) {
      if (this.enums.get(key) === this.value) return key
    }
    return ''
  }

  private displayName(name: string): string {
    return this.$i18n.t(name).toString()
  }

  private handleDropdownDisplay(command: string): void {
    this.valueName = command
  }

  @Watch('value')
  private onValueChange() {
    console.log('t',this.valueName,this.getKeyName)
    this.valueName = this.getKeyName
  }

  @Emit("input")
  private onInputChange(): string | number {
    console.log('t',this.valueName,this.getKeyName)
    return this.enumsMap.get(this.valueName) ?? ''
  }
}