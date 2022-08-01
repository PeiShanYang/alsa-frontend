import { Component, Vue } from 'vue-property-decorator';
import Api from '@/services/api.service';
import { Message } from 'element-ui';
import storeService from '@/services/store.service';
import { SetProjectUserReq } from '@/io/rest/setProjectUser';



class userInfo {
    name = '';
    role = '';
}

@Component
export default class ProjectAuth extends Vue {

    private triggerEdit = false;

    private globalUsers: string[] = [];

    private userList: userInfo[] = [];

    private openAddUserDialog = false

    private addUserData: SetProjectUserReq = new SetProjectUserReq


    private openRemoveUserDialog = false
    private removeUserData: SetProjectUserReq = new SetProjectUserReq

    private mounted(): void {
        this.$i18n.locale = "zh-tw"
        this.waitGetUsers()
    }

    private async waitGetUsers(): Promise<void> {

        if (!storeService.currentProject) return

        const res = await Api.usersProject(storeService.currentProject)
        this.globalUsers = res.users
        if (this.globalUsers.length === 0) return

        const members = new Map<string, string>(Object.entries(res.members))
        this.userList = []
        members.forEach((role, name) => this.userList.push({ name, role }))
    }

    private roleName(name: string): string {
        return this.$i18n.t(name).toString();
    }


    private addUserSetting(): void {
        this.addUserData = new SetProjectUserReq
        this.addUserData.projectName = storeService.currentProject ?? ''
        this.openAddUserDialog = true
    }

    private async handleAddUser(): Promise<void> {

        const res = await Api.addProjectUser(this.addUserData.projectName, this.addUserData.username, this.addUserData.auth)
        if (res === "success") {
            Message.success('新增成功')
            await this.waitGetUsers()
            this.openAddUserDialog = false
        } else {
            Message.error(res)
            return
        }
    }

    private removeUserSetting(username: string, role: string): void {
        this.removeUserData = {
            username,
            auth: role,
            projectName: storeService.currentProject ?? ''
        }
        this.openRemoveUserDialog = true
    }

    private async handleRemoveUser(): Promise<void> {

        const res = await Api.removeProjectUser(this.removeUserData.projectName, this.removeUserData.username, this.removeUserData.auth)
        if (res === "success") {
            Message.success("刪除成功")
            await this.waitGetUsers()
            this.openRemoveUserDialog = false
        } else {
            Message.error(res)
            return
        }
    }


    private async handleModifyUser(username: string): Promise<void> {
        const user = this.userList.find(item => item.name === username)
        if (!user) return

        const roleChange = user.role === "owner" ? 'user' : 'owner'

        if (!storeService.currentProject) return

        const switchRoleRes = await Api.modifyProjectUser(storeService.currentProject, user.name, roleChange)
        if (switchRoleRes === "success") {
            Message.success("權限變更成功")
            user.role = roleChange
        } else {
            Message.error(switchRoleRes)
            return
        }
    }

}