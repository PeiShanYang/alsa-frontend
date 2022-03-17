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
  private datasetOptions = [
    {
      value: "all data",
      label: "所有資料集",
    },
    {
      value: "dataset 001",
      label: "001 dataset",
    },
  ];
  private acitveDatasetCollapse: string[] = ["1"];


  get projectName(): string {
    return this.$route.params.projectName
  }


  private datasets: Map<string, DatasetStatus> = new Map<string, DatasetStatus>();
  private openDialogCheckDataset = false;


  mounted(): void {
    this.waitGetDatasets()
  }

  @Watch('openDialogCheckDataset')
  onDialogChange():void{
    this.waitGetDatasets()
  }

  private async waitGetDatasets(): Promise<void> {
    const res = await Api.getDatasets(store.currentProject ?? '')
    if (res) this.datasets = res
  }

}