import { Project } from '@/io/project';
import Api from '@/services/api.service';
import storeService from '@/services/store.service';
import { Component, Vue } from 'vue-property-decorator';
import DialogMessage from '@/components/dialogs/dialog-message/DialogMessage.vue';
import DialogMessageData from '@/io/dialogMessageData';
import { Message } from 'element-ui';
import { UserInfo } from '@/io/users';

@Component({
  components: {
    "dialog-message": DialogMessage,
  }
})
export default class Sidebar extends Vue {

  get userInfo(): UserInfo {
    return storeService.userInfo
}

  get projectList(): Map<string, Project> {
    if (this.searchProject === '') return storeService.projectList;

    return new Map<string, Project>(
      Array.from(
        storeService.projectList.entries()
      ).filter(
        (value) => value[0].toUpperCase().includes(
          this.searchProject.toUpperCase()
        )
      )
    );
  }

  get isCollapse(): boolean {
    return storeService.sidebarCollapse
  }

  private searchProject = '';
  private removeDialog = false;
  private dialogMessageData: DialogMessageData = new DialogMessageData()
  private remvoeProjectName = '';


  private created(): void {
    Api.getProjects();
  }

  private askRemoveProject(projectName: string): void {

    if (projectName === '') return
    this.remvoeProjectName = projectName

    this.dialogMessageData = {
      ...this.dialogMessageData,
      type: 'warning',
      title: `確定刪除專案 ${this.remvoeProjectName}`,
      subtitle: '注意 : 此動作會一並刪除待執行的實驗',
    }

    this.removeDialog = true
    return
  }

  private async handleReomveProject(): Promise<void> {

    const response = await Api.removeProject(this.remvoeProjectName)

    if (response === "success") {
      await Api.getProjects()
      Message.success('專案刪除成功')
      if (this.$route.path !== '/') this.$router.push(`/`)
    } else {
      Message.error(response)
    }
    this.removeDialog = false
  }

}