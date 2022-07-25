import { Component, Vue } from 'vue-property-decorator';
import store from "@/services/store.service";
import DialogMessage from '@/components/dialogs/dialog-message/DialogMessage.vue';
import DialogMessageData from '@/io/dialogMessageData';
import { Message } from 'element-ui';
import Api from '@/services/api.service';

@Component({
  components: {
    "dialog-message": DialogMessage,
  }
})
export default class Navbar extends Vue {
  get projectName(): string {
    return this.$route.params.projectName;
  }

  get currentComponent(): string {
    return this.$route.name ?? '';
  }

  private openDialogChangePassword = false;
  private dialogPasswordData: DialogMessageData = new DialogMessageData

  private handleCollapse(): void {
    store.sidebarCollapse = !store.sidebarCollapse
  }

  private sendPasswordData(): void {
    this.dialogPasswordData = {
      ...this.dialogPasswordData,
      content: [{ inputName: "舊密碼", inputContent: "" }, { inputName: "新密碼", inputContent: "" }, { inputName: "確認新密碼", inputContent: "" }]
    }
    this.openDialogChangePassword = true
  }

  private async handleChangePassword(content: { inputName: string, inputContent: string }[]): Promise<void> {

    const oldPassword = content.find(item => item.inputName === "舊密碼")?.inputContent ?? ''
    const newPassword01 = content.find(item => item.inputName === "新密碼")?.inputContent ?? ''
    const newPassword02 = content.find(item => item.inputName === "確認新密碼")?.inputContent ?? ''

    if (oldPassword === '' || newPassword01 === '' || newPassword02 === '') return

    if (newPassword01 !== newPassword02) {
      Message.error('密碼輸入錯誤')
      return
    }

    const res = await Api.changePassword(newPassword01)
    if (res === "success") {
      Message.success('密碼修改成功')
      this.openDialogChangePassword = false
    } else {
      Message.error(res)
    }
  }

  private handleLogout(): void {

    document.cookie = 'salaCookies=; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    store.salaCookies = ''
    this.$router.push('/login')
  }

}