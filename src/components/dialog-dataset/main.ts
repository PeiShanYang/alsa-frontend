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

  @Emit("set-dataset")
  async setExperimentDataset() {

    const experimentId = store.projectList.get(store.currentProject ?? '')?.experiments?.keys().next().value

    if (store.currentProject && this.checkedPath !== "") {
      await Api.setExperimentDataset(store.currentProject, experimentId, this.checkedPath)
      return this.datasets.get(this.checkedPath)
    }

    return

  }


  private datasets: Map<string, DatasetStatus> = new Map<string, DatasetStatus>();
  private checkedPathList = [];
  private checkedPath = "";

  @Watch('dialogOpen')
  onDialogChange(value: boolean): void {
    if (value) {
      // Api.getDatasets(store.currentProject ?? '');
      this.waitGetDatasets()
    }
  }

  addDataset(): void {
    console.log('to add dataset');
  }


  private async waitGetDatasets(): Promise<void> {
    const res = await Api.getDatasets(store.currentProject ?? '')
    if (res) this.datasets = res
  }

  private handleCheckPath(checkItem: string[]) {

    if (checkItem[0]) {
      this.checkedPath = checkItem[0]
    }

  }
}
