import { Component, Vue } from 'vue-property-decorator';
import DialogMessage from '@/components/dialog-message/DialogMessage.vue';
import DialogMessageData from '@/io/dialogMessageData';
import Api from '@/services/api.service';
import store from '@/services/store.service';


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
        this.inputSolutionKey = content.find(item => item.inputName === "請輸入您的解決方案金鑰")?.inputContent ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDb25maWciOnsiUHJpdmF0ZVNldHRpbmciOnsiZGF0YXNldFBhdGgiOiIifX0sIkNvbmZpZ01vZGVsU2VydmljZSI6eyJMb3NzRnVuY3Rpb25QYXJhIjp7Imxvc3NGdW5jdGlvbiI6IkNyb3NzRW50cm9weUxvc3MifSwiTGVhcm5pbmdSYXRlIjp7ImxlYXJuaW5nUmF0ZSI6MC4wMDF9LCJPcHRpbWl6ZXJQYXJhIjp7IlNHRCI6eyJzd2l0Y2giOjEsIm1vbWVudHVtIjowLjksImRhbXBlbmluZyI6MCwid2VpZ2h0RGVjYXkiOjAuMDAwNSwibmVzdGVyb3YiOjB9fSwiU2NoZWR1bGVyUGFyYSI6eyJzdGVwTFIiOnsic3dpdGNoIjoxLCJzdGVwU2l6ZSI6MSwiZ2FtbWEiOjAuNX19fSwiQ29uZmlnUHl0b3JjaE1vZGVsIjp7IlNlbGVjdGVkTW9kZWwiOnsibW9kZWwiOnsic3RydWN0dXJlIjoiYXVvX3VucmVzdHJpY3RlZF9wb3dlcmZ1bF9tb2RlbCIsInByZXRyYWluZWQiOjF9fSwiQ2xzTW9kZWxQYXJhIjp7ImJhdGNoU2l6ZSI6MSwiZXBvY2hzIjoxfX19.0RZhruLVeW8anDr_IrxcKGPbHSCxF9fa-YHl_bskr-M"

        const re = new RegExp('^[A-Za-z]\\w{0,}$')


        let checkStrictName = true

        if(this.inputProjectName.match(re) === null){

            const h = this.$createElement;
            this.$message({
                type: 'error',
                message: h('h3', { style: 'color:#F56C6C;' }, "1.專案名稱開頭須為大小英文字母 2.專案名稱不得包含特殊字元"),
            })

            checkStrictName = false
            return

        }

        
        let response = false
        if (checkStrictName === true && this.inputProjectName !== "" && this.inputSolutionKey !== "") {

            response = await Api.createProjectByKey(this.inputProjectName, this.inputSolutionKey);

            Array.from(
                store.projectList.entries()
            ).forEach((project) => {
                if (project[0].includes(this.inputProjectName)) {
                    this.$router.push({ name: 'experiments', params: { projectName: this.inputProjectName } })
                }
            })

        }

        if (response === false) {
            const h = this.$createElement;
            this.$message({
                type: 'error',
                message: h('h3', { style: 'color:#F56C6C;' }, "專案建立失敗"),
            })
            return
        } else {
            this.inputProjectName = '';
            this.inputSolutionKey = '';
            this.openDialogMessage = false;
        }


    }

}