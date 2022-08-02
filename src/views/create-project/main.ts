import { Component, Vue } from 'vue-property-decorator';
import DialogMessage from '@/components/dialogs/dialog-message/DialogMessage.vue';
import DialogMessageData from '@/io/dialogMessageData';
import Api from '@/services/api.service';
import store from '@/services/store.service';
import { Message } from 'element-ui';


@Component({
    components: {
        "dialog-message": DialogMessage,
    }
})
export default class CreateProject extends Vue {

    private openDialogMessage = false;
    private dialogMessageData: DialogMessageData = new DialogMessageData()

    private inputProjectName = '';
    private inputSolutionKey = '';

    private importSolutionKey(): void {
        this.dialogMessageData = {
            ...this.dialogMessageData,
            content: [{ inputName: "專案名稱", inputContent: "" }, { inputName: "請輸入您的解決方案金鑰", inputContent: "" }]
        }
        this.openDialogMessage = true
    }

    private createEmpty(): void {
        this.dialogMessageData = {
            ...this.dialogMessageData,
            content: [{ inputName: "專案名稱", inputContent: "" }]
        }
        this.openDialogMessage = true
    }

    private async createProjectByKey(content: { inputName: string, inputContent: string }[]): Promise<void> {

        this.inputProjectName = content.find(item => item.inputName === "專案名稱")?.inputContent ?? ''
        this.inputSolutionKey = content.find(item => item.inputName === "請輸入您的解決方案金鑰")?.inputContent ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDb25maWciOnsiUHJpdmF0ZVNldHRpbmciOnsiZGF0YXNldFBhdGgiOiIifX0sIkNvbmZpZ1ByZXByb2Nlc3MiOnsiUHJlcHJvY2Vzc1BhcmEiOnsibm9ybWFsaXplIjp7InN3aXRjaCI6MSwibW9kZSI6IkltYWdlTmV0In0sInJlc2l6ZSI6eyJzd2l0Y2giOjEsImltYWdlU2l6ZSI6WzIyNCwyMjRdLCJpbnRlcnBvbGF0aW9uIjoiQklMSU5FQVIifX19LCJDb25maWdBdWdtZW50YXRpb24iOnsiQXVnbWVudGF0aW9uUGFyYSI6e319LCJDb25maWdNb2RlbFNlcnZpY2UiOnsiTG9zc0Z1bmN0aW9uUGFyYSI6eyJsb3NzRnVuY3Rpb24iOiJDcm9zc0VudHJvcHlMb3NzIn0sIkxlYXJuaW5nUmF0ZSI6eyJsZWFybmluZ1JhdGUiOjAuMDAxfSwiT3B0aW1pemVyUGFyYSI6eyJTR0QiOnsic3dpdGNoIjoxLCJtb21lbnR1bSI6MC45LCJkYW1wZW5pbmciOjAsIndlaWdodERlY2F5IjowLjAwMDUsIm5lc3Rlcm92IjowfX0sIlNjaGVkdWxlclBhcmEiOnsic3RlcExSIjp7InN3aXRjaCI6MSwic3RlcFNpemUiOjEsImdhbW1hIjowLjV9fX0sIkNvbmZpZ1B5dG9yY2hNb2RlbCI6eyJTZWxlY3RlZE1vZGVsIjp7Im1vZGVsIjp7InN0cnVjdHVyZSI6ImF1b191bnJlc3RyaWN0ZWRfcG93ZXJmdWxfbW9kZWwiLCJwcmV0cmFpbmVkIjoxfX0sIkNsc01vZGVsUGFyYSI6eyJiYXRjaFNpemUiOjEsImVwb2NocyI6MX19fQ.tQ3CTMTR4HkmT0jsUaUNTZJnc3jXS_b8vFCCeg0V2no"

        const re = new RegExp('^[A-Za-z]\\w{0,}$')


        let checkStrictName = true

        if(this.inputProjectName.match(re) === null){

            Message.error("1.專案名稱開頭須為大小英文字母 2.專案名稱不得包含特殊字元")

            checkStrictName = false
            return

        }

        
        let response = false
        if (checkStrictName === true && this.inputProjectName !== "" && this.inputSolutionKey !== "") {

            response = await Api.createProjectByKey(this.inputProjectName, this.inputSolutionKey);
            await Api.getProjects()

            Array.from(
                store.projectList.entries()
            ).forEach((project) => {
                if (project[0].includes(this.inputProjectName)) {
                    this.$router.push({ name: 'experiments', params: { projectName: this.inputProjectName } })
                }
            })

        }

        if (response === false) {
            Message.error("專案建立失敗")
            return
        } else {
            this.inputProjectName = '';
            this.inputSolutionKey = '';
            this.openDialogMessage = false;
        }


    }

}