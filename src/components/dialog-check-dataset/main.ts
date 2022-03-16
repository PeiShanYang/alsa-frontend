import { DatasetStatus } from '@/io/dataset';
import Api from '@/services/api.service';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';


@Component
export default class DialogCheckDataset extends Vue {
  @Prop() private dialogOpen!: boolean;

  private inputDatasetPath = "";

  @Emit('cancel-check')
  cancelCheckDataset(): void {

    this.inputDatasetPath = ""

    return;
  }

  @Emit('confirm-check')
  async confrimCheckDataset() {

    if (this.inputDatasetPath === "") return;

    await Api.checkDataset(this.inputDatasetPath)
    
    this.inputDatasetPath = ""

    return 

  }



}