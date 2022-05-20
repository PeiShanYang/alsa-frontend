import { Component, Vue, Watch } from 'vue-property-decorator';
import DialogMessage from '@/components/dialog-message/DialogMessage.vue';
import DialogMessageData from '@/io/dialogMessageData';
import Api from '@/services/api.service';
import store from '@/services/store.service';
import { DatasetStatus } from '@/io/dataset';

@Component({
  components: {
    "dialog-message": DialogMessage,
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

  private datasets: Map<string, DatasetStatus> | undefined = new Map<string, DatasetStatus>();

  private openDialogMessage = false;
  private dialogMessageData: DialogMessageData = new DialogMessageData()


  get projectName(): string {
    return this.$route.params.projectName
  }

  @Watch('openDialogMessage')
  onDialogChange(): void {
    this.waitGetDatasets()
  }

  mounted(): void {
    if (this.$route.params.settingPath) setTimeout(this.settingDatasetPath, 500);
    this.waitGetDatasets()
  }

  private async waitGetDatasets(): Promise<void> {

    if (!store.currentProject) return

    await Api.getDatasets(store.currentProject)

    const project = store.projectList.get(store.currentProject)
    if(!project) return

    this.datasets = project.datasets

  }

  private settingDatasetPath(): void {
    this.dialogMessageData = {
      ...this.dialogMessageData,
      content: [{ inputName: "設定資料集位置", inputContent: "" }]
    }
    this.openDialogMessage = true
  }

  private async checkDataset(content: { inputName: string, inputContent: string }[]): Promise<void> {

    const datasetPath = content.find(item => item.inputName === "設定資料集位置")?.inputContent

    if (!datasetPath) return;
    if (datasetPath === "") return
    await Api.checkDataset(datasetPath)

    this.openDialogMessage = false
    
  }

}