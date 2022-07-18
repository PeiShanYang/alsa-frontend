import { Project } from '@/io/project';
import Api from '@/services/api.service';
import store from "@/services/store.service";
import { Component, Vue } from 'vue-property-decorator';
import DialogMessage from '@/components/dialogs/dialog-message/DialogMessage.vue';
import DialogMessageData from '@/io/dialogMessageData';
import { Message } from 'element-ui';

@Component({
  components: {
    "dialog-message": DialogMessage,
  }
})
export default class Sidebar extends Vue {
  private searchProject = '';
  private removeDialog = false;
  private dialogMessageData: DialogMessageData = new DialogMessageData()
  private remvoeProjectName = '';


  created(): void {
    Api.getProjects();
  }

  get projectList(): Map<string, Project> {
    if (this.searchProject === '') return store.projectList;

    return new Map<string, Project>(
      Array.from(
        store.projectList.entries()
      ).filter(
        (value) => value[0].toUpperCase().includes(
          this.searchProject.toUpperCase()
        )
      )
    );
  }

  get isCollapse(): boolean {
    return store.sidebarCollapse
  }

  private askRemoveProject(projectName: string): void {

    if(projectName === '') return
    this.remvoeProjectName = projectName

    this.dialogMessageData = {
      ...this.dialogMessageData,
      type: 'warning',
      title: `確定刪除專案 ${this.remvoeProjectName}?`,
    }

    this.removeDialog = true
    return
  }

  private async handleReomveProject():Promise<void>{

    const response = await Api.removeProject(this.remvoeProjectName)

    if(response){
      Message.success('專案刪除成功')
    }else{
      Message.error('專案刪除失敗')
    }

    this.$router.push(`/`)

    this.removeDialog = false

    return
  }

}