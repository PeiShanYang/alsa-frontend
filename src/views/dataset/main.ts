import { Component, Vue } from 'vue-property-decorator';
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

  // get datasets(): Map<string,DatasetStatus> |null {
  //   return 
  // }

  private datatsets = [{}];

  private openDialogCheckDataset = false;


  mounted(): void {
    this.waitGetDatasets()
  }

  private async waitGetDatasets(): Promise<void> {
    const res = await Api.getDatasets(store.currentProject!)
    if (res?.message !== "success") this.openDialogCheckDataset = true
    if (res?.data) {
      // this.datatsets = res?.data
      console.log("res data", Object.entries(res.data))

      this.datatsets = Object.entries(res.data).map( element=>{
        return {
          path : element[0],
          labeled: element[1].labeled,
          split: element[1].split,
          uploaded: element[1].uploaded
        }
      })

    }
  }

}