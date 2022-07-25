import { Component, Vue } from 'vue-property-decorator';
import Logger from '@/services/log.service';


class userInfo {
    id = "";
    name = '';
    role = '';
}

@Component
export default class AuthMgmt extends Vue {

    private triggerEdit = false;

    private userList: userInfo[] = [];

    private mounted(): void {
        this.userList = [{ id: "01", name: "chunhaoLiao", role: "admin" },{ id: "02", name: "frank", role: "admin" },{ id: "03", name: "frank", role: "NotAdmin" }]
    }

    private handleSwitch(userId:string):void{
        const user = this.userList.find(item => item.id === userId)
        if(!user) return
        
        user.role === "admin" ? user.role= "NotAdmin" : user.role ="admin"

        console.log("te",user)
    }

}