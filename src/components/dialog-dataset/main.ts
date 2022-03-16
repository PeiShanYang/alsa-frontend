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
    }

    // this.datasets.filter( item => item.path === this.checkedPath)
    // console.log("this datasets",this.datasets.filter( item => item.path === this.checkedPath))

    return this.datasets.filter( item => item.path === this.checkedPath)[0];
  }



  // get datasets(): Map<string, DatasetStatus> | null {
  //   return store.projectList.get(store.currentProject ?? '')?.datasets ?? null;
  // }
  private datasets : {path:string,labeled:string,split:string,uploaded:string}[] = [];
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
    if (res?.data) {
      this.datasets = Object.entries(res.data).map(element => {
        return {
          path: element[0],
          labeled: element[1].labeled,
          split: element[1].split,
          uploaded: element[1].uploaded
        }
      })

    }
  }

  private handleCheckPath(checkItem: string[]) {

    if (checkItem[0]) {
      this.checkedPath = checkItem[0]
    }

  }
}
