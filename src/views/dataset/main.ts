import { Component, Vue, Watch } from 'vue-property-decorator';
import DialogMessage from '@/components/dialog-message/DialogMessage.vue';
import DialogMessageData from '@/io/dialogMessageData';
import Api from '@/services/api.service';
import store from '@/services/store.service';
import { DatasetStatus } from '@/io/dataset';
import { VueTreeList, Tree, TreeNode } from 'vue-tree-list';

@Component({
  components: {
    "dialog-message": DialogMessage,
    "vue-tree-list":VueTreeList,
  }
})
export default class Dataset extends Vue {

  private acitveDatasetCollapse: string[] = ["1"];
  private searchDataset = '';

  private datasets: Map<string, DatasetStatus> | undefined = new Map<string, DatasetStatus>();

  private openDialogMessage = false;
  private dialogMessageData: DialogMessageData = new DialogMessageData()

  private newTree = {};

  private data = new Tree([
    {
      name: 'Node 1',
      id: 1,
      pid: 0,
      dragDisabled: true,
      addTreeNodeDisabled: true,
      addLeafNodeDisabled: true,
      editNodeDisabled: true,
      delNodeDisabled: true,
      children: [
        {
          name: 'Node 1-2',
          id: 'tests',
          isLeaf: true,
          pid: 1
        }
      ]
    },
    {
      name: 'Node 2',
      id: 3,
      pid: 0,
      disabled: true
    },
    {
      name: 'Node 3',
      id: 4,
      pid: 0,
      addLeafNodeDisabled: true,
    }
  ])


  get projectName(): string {
    return this.$route.params.projectName
  }

  get datasetList(): Map<string, DatasetStatus> | undefined {
    
    if(!this.datasets) return
    if (this.searchDataset === '') return this.datasets

    return new Map<string, DatasetStatus>([...this.datasets]
      .filter(item=> item[0].toUpperCase().includes(this.searchDataset.toUpperCase())));

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
    if (!project) return

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
    const response = await Api.checkDataset(datasetPath)

    if (response === false) {
      const h = this.$createElement;
      this.$message({
        type: 'error',
        message: h('h3', { style: 'color:#F56C6C;' }, "資料集位置設置錯誤"),
      })
    } else {
      this.openDialogMessage = false
    }

  }

}