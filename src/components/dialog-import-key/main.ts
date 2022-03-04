import { Component, Prop, Vue, Emit } from 'vue-property-decorator';


@Component
export default class DialogImportKey extends Vue {
  @Prop() private dialogOpen!: boolean;


  get openDialogImportKey() {
    return this.dialogOpen
  }
  set openDialogImportKey(value: boolean) {
    this.closeDialogImportKey()
  }
  @Emit("dialog-close")
  closeDialogImportKey() {
    return false;
  }
  
  private inputProjectName = '';
  private inputSolutionKey = '';

  private test():void{
    console.log("testtt")
}


}