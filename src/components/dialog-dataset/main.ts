import Api from '@/services/api.service';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component
export default class DialogDataset extends Vue {
  @Prop() private dialogOpen!: boolean;


  @Emit("dialog-close")
  closeDialogDataset() {
    return ;
  }

  @Emit("check-dataset")
  checkDataset(){

    if (this.inputDatasetPath !== ''){
      Api.checkDataset(this.inputDatasetPath)
    }

    this.inputDatasetPath = ''

    return
  }

  private inputDatasetPath = '';

  // private activeDatasetCollapse: string[] = ["1"];
  // private datasetSearch = '';
  // private progressColor = "#fff";
  // private progressPercentage = 88;
  // private datasetCheckBox = false;
  
}


