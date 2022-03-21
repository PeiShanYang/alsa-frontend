import { Component, Prop, Vue, Emit} from 'vue-property-decorator';
import { DatasetStatus } from '@/io/dataset';

@Component
export default class DialogDataset extends Vue {
  @Prop() private dialogOpen!: boolean;
  @Prop() private experimentId!: string;
  @Prop() private datasetList!:Map<string, DatasetStatus>;

  private searchPattern = '';
  private activeDatasetCollapse: string[] = ["1"];
  private progressPercent = 0;
  private inputDatasetPath = '';

  @Emit("dialog-close")
  closeDialogDataset(): void {
    return;
  }

  @Emit("set-dataset")
  async setExperimentDataset():Promise<string | undefined>{

    if (this.checkedPath == "") return

    return this.checkedPath
  }

  private defaultPath = "";
  private checkedPath = "";
  
  private handleCheckPath(checkItem: string) {
    if (checkItem) this.checkedPath = checkItem
  }
}
