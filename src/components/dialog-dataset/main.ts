import Api from '@/services/api.service';
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import store from "@/services/store.service";
import { DatasetStatus } from '@/io/dataset';

@Component
export default class DialogDataset extends Vue {
  @Prop() private dialogOpen!: boolean;
  @Prop() private experimentId!: string;

  private searchPattern = '';
  private activeDatasetCollapse: string[] = ["1"];
  private progressPercent = 0;
  private inputDatasetPath = '';

  @Emit("dialog-close")
  closeDialogDataset(): void {
    return;
  }

  @Emit("check-dataset")
  async checkDataset(): Promise<void> {
    if (this.inputDatasetPath !== ''){
      await Api.checkDataset(this.inputDatasetPath)

      this.$router.push({ name: 'dataset', params: { projectName: store.currentProject ?? '' } })
    }
    this.inputDatasetPath = ''

    return
  }

  get datasets(): Map<string, DatasetStatus> | null {
    return store.projectList.get(store.currentProject ?? '')?.datasets ?? null;
  }

  @Watch('dialogOpen')
  onDialogChange(value: boolean): void {
    if (value) {
      Api.getDatasets(store.currentProject ?? '');
    }
  }

  addDataset(): void {
    console.log('to add dataset');
  }
}
