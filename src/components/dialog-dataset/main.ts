import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component
export default class DialogDataset extends Vue {
  @Prop() private dialogOpen!: boolean;

  get openDialogDataset() {
    return this.dialogOpen
  }
  set openDialogDataset(value: boolean) {
    this.closeDialogDataset()
  }
  @Emit("dialog-close")
  closeDialogDataset() {
    return false;
  }

  private activeDatasetCollapse: string[] = ["1"];
  private datasetSearch = '';
  private progressColor = "#fff";
  private progressPercentage = 88;
  private datasetCheckBox = false;
  

}


