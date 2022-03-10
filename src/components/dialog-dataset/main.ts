import Api from '@/services/api.service';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import store from "@/services/store.service";

@Component
export default class DialogDataset extends Vue {
  @Prop() private dialogOpen!: boolean;


  @Emit("dialog-close")
  closeDialogDataset() {
    return ;
  }

  @Emit("check-dataset")
  async checkDataset(){

    if (this.inputDatasetPath !== ''){
      await Api.checkDataset(this.inputDatasetPath)

      this.$router.push({ name: 'dataset', params: { projectName: store.currentProject! } })
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


