import { Component, Vue } from 'vue-property-decorator';
import store from "@/services/store.service";

@Component
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
    {
      value: "dataset 002",
      label: "002 dataset",
    },
    {
      value: "dataset 003",
      label: "003 dataset",
    },
    {
      value: "dataset 004",
      label: "004 dataset",
    },
    {
      value: "dataset 005",
      label: "005 dataset",
    },
  ];
  private acitveDatasetCollapse: string[] = ["1"];

 
  get projectName(): string {
    return this.$route.params.projectName
  }

  get datasetPath(): string{
    return store.currentDatasetURLInput ?? '/'
  }

  get checkList(): string[]{

    const returnList : string[] = []

    if (store.currentDatasetStatus){
      Object.entries(store.currentDatasetStatus).forEach( element=>{
        if (element[1] === true) returnList.push(element[0])
      })
    }
    return returnList
  } 


}