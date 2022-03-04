import { Component, Prop, Vue, Emit } from 'vue-property-decorator';


@Component
export default class DialogImportKey extends Vue {
  @Prop() private dialogOpen!: boolean;
  private inputProjectName = '';
  private inputSolutionKey = '';

  set openDialogDataset(value: boolean) {
    this.closeDialogImportKey()
  }

  @Emit("dialog-close")
  closeDialogImportKey() {
    return;
  }
}