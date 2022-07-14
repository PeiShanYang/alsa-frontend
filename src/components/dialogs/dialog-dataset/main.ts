import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { DatasetStatus } from '@/io/dataset';
import Api from '@/services/api.service';
import store from '@/services/store.service';

@Component
export default class DialogDataset extends Vue {
  @Prop() private dialogOpen!: boolean;
  @Prop() private default!: string;
  @Prop() private experimentId!: string;

  private newPara = this.default
  private configs = new Map<string, DatasetStatus>()
  private init = false


  @Emit("dialog-close")
  closeDialogDataset(): void {
    return;
  }

  @Emit("set-para")
  setPara(): string {
    return this.newPara
  }

  mounted(): void {
    this.waitConfigsSetting()
  }

  updated(): void {
    if (!this.init && this.default !== '') {
      this.newPara = this.default
      this.init = true
    }
  }

  private async waitConfigsSetting(): Promise<void> {
    if (!store.currentProject) return
    await Api.getDatasets(store.currentProject)
    this.configs = store.projectList.get(store.currentProject)?.datasets ?? new Map<string, DatasetStatus>()
  }

  private updateOption(pathName: string) {
    this.newPara = pathName
  }

}
