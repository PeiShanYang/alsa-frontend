import { Component, Vue, Watch } from 'vue-property-decorator';
import DialogTreeList from '@/components/dialog-tree-list/DialogTreeList.vue';
import Api from '@/services/api.service';
import store from '@/services/store.service';
import { DatasetStatus } from '@/io/dataset';

@Component({
  components: {
    "dialog-tree-list": DialogTreeList,
  }
})
export default class Dataset extends Vue {

  private acitveDatasetCollapse: string[] = ["1"];
  private searchDataset = '';

  private datasets: Map<string, DatasetStatus> | undefined = new Map<string, DatasetStatus>();

  private setDatasetPathDialog = false;
  private setDatasetPathDialogData = { rootPath:'datasets',title: '設定資料集位置', content: '' };

  get projectName(): string {
    return this.$route.params.projectName
  }

  get datasetList(): Map<string, DatasetStatus> | undefined {

    if (!this.datasets) return
    if (this.searchDataset === '') return this.datasets

    return new Map<string, DatasetStatus>([...this.datasets]
      .filter(item => item[0].toUpperCase().includes(this.searchDataset.toUpperCase())));

  }

  @Watch('setDatasetPathDialog')
  onDialogChange(): void {
    this.waitGetDatasets()
  }

  mounted(): void {
    if (this.$route.params.settingPath) setTimeout(()=>{this.setDatasetPathDialog = true}, 500);
    this.waitGetDatasets()
  }

  private async waitGetDatasets(): Promise<void> {

    if (!store.currentProject) return

    await Api.getDatasets(store.currentProject)

    const project = store.projectList.get(store.currentProject)
    if (!project) return

    this.datasets = project.datasets

  }

  
  private async checkDataset(datasetPath: string): Promise<void> {

    if (datasetPath === "") return
    const response = await Api.checkDataset(datasetPath)

    if (response === false) {
      const h = this.$createElement;
      this.$message({
        type: 'error',
        message: h('h3', { style: 'color:#F56C6C;' }, "資料集位置設置錯誤"),
      })
    } else {
      this.setDatasetPathDialog = false
    }

    this.setDatasetPathDialogData.content = ''

  }

  

}