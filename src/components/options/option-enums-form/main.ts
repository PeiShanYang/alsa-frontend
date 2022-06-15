import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component
export default class OptionEnumsForm extends Vue {
  @Prop() private enums!: Map<string, string | number>
  @Prop() private value!: string | number

  private v = this.value

  private get enumsMap(): Map<string, string | number> {
    console.log(this.enums)
    return new Map<string, string | number>(this.enums)
  }

  private get keyName(): string {
    for (const key in this.enumsMap.keys()) {
      if (this.enums.get(key) === this.v) return key
    }
    return ''
  }

  private handleDropdownDisplay(command: string): void {
    this.v = this.enumsMap.get(command) ?? ''
  }

  // @Emit("input")
  // private onInputChange(): string | number {
  //   return this.v
  // }
}