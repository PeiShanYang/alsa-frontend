import { Component, Vue } from 'vue-property-decorator';
import { Message } from 'element-ui';
import Api from '@/services/api.service';
import { UserInfo } from '@/io/users';
import storeService from '@/services/store.service';

class changePasswordData {
  oldPassword = '';
  newPassword = '';
  newPasswordCheck = ''
}

@Component
export default class Navbar extends Vue {
  get projectName(): string {
    return this.$route.params.projectName;
  }

  get currentComponent(): string {
    return this.$route.name ?? '';
  }

  get userInfo(): UserInfo {
    return storeService.userInfo
  }

  private openChangePasswordDialog = false;
  private changePasswordData: changePasswordData = new changePasswordData()


  private mounted(): void {
    return
  }

  private handleCollapse(): void {
    storeService.sidebarCollapse = !storeService.sidebarCollapse
  }
  private changePasswordSetting(): void {
    this.changePasswordData = new changePasswordData()
    this.openChangePasswordDialog = true
  }

  private async handleChangePassword(): Promise<void> {

    const { oldPassword, newPassword, newPasswordCheck } = this.changePasswordData

    if (oldPassword === '' || newPassword === '' || newPasswordCheck === '') {
      Message.error("輸入欄位不可為空")
      return
    }

    if (newPassword !== newPasswordCheck) {
      Message.error('密碼輸入錯誤')
      return
    }

    const res = await Api.changePassword(oldPassword, newPassword)
    if (res === "success") {
      Message.success('密碼修改成功')
      this.openChangePasswordDialog = false
    } else {
      Message.error(res)
    }
  }

  private handleLogout(): void {

    document.cookie = 'salaCookies=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    storeService.userInfo = new UserInfo()
    this.$router.push('/login')
  }

}