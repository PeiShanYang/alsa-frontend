import { Component, Vue } from 'vue-property-decorator';
import Api from '@/services/api.service';
import { AddUserReq } from '@/io/rest/addUser';
import { Message } from 'element-ui';



class userInfo {
    name = '';
    role = '';
}

@Component
export default class ProjectAuth extends Vue {

    private triggerEdit = false;

    private userList: userInfo[] = [];

    private openAddUserDialog = false

    private addUserData: AddUserReq = new AddUserReq
    private addUserCheckPassword = ''

    private openRemoveUserDialog = false
    private removeUsername = ''

    private mounted(): void {
        this.$i18n.locale = "zh-tw"
        this.waitGetUsers()
    }

    private async waitGetUsers(): Promise<void> {

        const res = await Api.usersAll()
        const { users, maintainers } = res

        if (users.length === 0) return
        this.userList = []
        users.forEach(user => {
            this.userList.push({
                name: user,
                role: maintainers.includes(user) ? "maintainer" : "notMaintainer"
            })
        })
    }

    private roleName(name: string): string {
        return this.$i18n.t(name).toString();
    }


    private addUserSetting(): void {
        this.addUserData = new AddUserReq
        this.addUserCheckPassword = ''
        this.openAddUserDialog = true
    }

    private async handleAddUser(): Promise<void> {

        if (this.addUserCheckPassword !== this.addUserData.password) {
            Message.error("密碼輸入不一致")
            return
        }

        const res = await Api.addUser(this.addUserData.username, this.addUserData.password, this.addUserData.maintainer)
        if (res === "success") {
            Message.success("使用者新增成功")
            await this.waitGetUsers()
            this.openAddUserDialog = false
        } else {
            Message.error(res)
            return
        }
    }

    private removeUserSetting(username: string): void {
        this.removeUsername = username
        this.openRemoveUserDialog = true
    }

    private async handleRemoveUser(): Promise<void> {

        const res = await Api.removeUser(this.removeUsername)
        if (res === "success") {
            Message.success("使用者刪除成功")
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

        const isMantainer = user.role === "maintainer" ? true : false
        // const modifyUserRes = awi
        const switchRoleRes = await Api.modifyUser(user.name, !isMantainer)
        if (switchRoleRes === "success") {
            Message.success("權限並更成功")
            user.role === "maintainer" ? user.role = "notMaintainer" : user.role = "maintainer"
        } else {
            Message.error(switchRoleRes)
            return
        }
    }

}