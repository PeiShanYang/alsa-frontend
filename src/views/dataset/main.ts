import { Component, Vue, Watch } from 'vue-property-decorator';
import store from "@/services/store.service";
import DialogCheckDataset from '@/components/dialog-check-dataset/DialogCheckDataset.vue';
import Api from '@/services/api.service';
import { DatasetStatus } from '@/io/dataset';

@Component({
  components: {
    "dialog-check-dataset": DialogCheckDataset,
  }
})
export default class Dataset extends Vue {


  private selectedDatasetValue = '';
  private datasetOptions: { value: string, label: string }[] = [
    {
      value: "all data",
      label: "所有資料集",
    },
  ];
  private acitveDatasetCollapse: string[] = ["1"];


  get projectName(): string {
    return this.$route.params.projectName
  }


  private datasets: Map<string, DatasetStatus> | undefined= new Map<string, DatasetStatus>();
  private openDialogCheckDataset = false;


  mounted(): void {
    if(this.$route.params.settingPath) setTimeout(()=>{this.openDialogCheckDataset = true},500)
    this.waitGetDatasets()
  }

  @Watch('openDialogCheckDataset')
  onDialogChange(): void {
    this.waitGetDatasets()
  }

  private async waitGetDatasets(): Promise<void> {

    if(!store.currentProject) return

    await Api.getDatasets(store.currentProject)
    this.datasets = store.projectList.get(store.currentProject)?.datasets

  }

}