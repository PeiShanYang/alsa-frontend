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
        this.inputSolutionKey = content.find(item => item.inputName === "請輸入您的解決方案金鑰")?.inputContent ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDb25maWciOnsiUHJpdmF0ZVNldHRpbmciOnsiZGF0YXNldFBhdGgiOiIifX0sIkNvbmZpZ0F1Z21lbnRhdGlvbiI6eyJBdWdtZW50YXRpb25QYXJhIjp7fX0sIkNvbmZpZ0V2YWx1YXRpb24iOnsiRXZhbHVhdGlvblBhcmEiOnsic2hvd0FjYyI6eyJzd2l0Y2giOjF9LCJzaG93Q2xhc3NBY2MiOnsic3dpdGNoIjoxfX19LCJDb25maWdNb2RlbFNlcnZpY2UiOnsiTG9zc0Z1bmN0aW9uUGFyYSI6eyJsb3NzRnVuY3Rpb24iOiJDcm9zc0VudHJvcHlMb3NzIn0sIkxlYXJuaW5nUmF0ZSI6eyJsZWFybmluZ1JhdGUiOjAuMDAxfSwiT3B0aW1pemVyUGFyYSI6eyJTR0QiOnsic3dpdGNoIjp0cnVlLCJtb21lbnR1bSI6MC45LCJkYW1wZW5pbmciOjAsIndlaWdodERlY2F5IjowLjAwMDUsIm5lc3Rlcm92IjpmYWxzZX19LCJTY2hlZHVsZXJQYXJhIjp7InN0ZXBMUiI6eyJzd2l0Y2giOjEsInN0ZXBTaXplIjoxLCJnYW1tYSI6MC4xfX19LCJDb25maWdQcmVwcm9jZXNzIjp7IlByZXByb2Nlc3NQYXJhIjp7Im5vcm1hbGl6ZSI6eyJzd2l0Y2giOjEsIm1vZGUiOiJJbWFnZU5ldCIsIm1lYW4iOm51bGwsInN0ZCI6bnVsbH0sInJlc2l6ZSI6eyJzd2l0Y2giOnRydWUsImltYWdlU2l6ZSI6WzIyNCwyMjRdLCJpbnRlcnBvbGF0aW9uIjoiQklMSU5FQVIifX19LCJDb25maWdQeXRvcmNoTW9kZWwiOnsiU2VsZWN0ZWRNb2RlbCI6eyJtb2RlbCI6eyJzdHJ1Y3R1cmUiOiJhdW9fdW5yZXN0cmljdGVkX3Bvd2VyZnVsX21vZGVsIiwicHJldHJhaW5lZCI6MX19LCJDbHNNb2RlbFBhcmEiOnsiYmF0Y2hTaXplIjoxNiwiZXBvY2hzIjoyfX0sIkNvbmZpZ1Jlc3VsdFN0b3JhZ2UiOnsidW5rbm93bkZpbHRlciI6eyJzd2l0Y2giOjAsImZpbHRlciI6eyJ1bmtub3duIjowLjl9LCJyZXZlcnNlIjowLCJzYXZlQ3N2IjoyfSwiZHJhd0NvbmZ1c2lvbk1hdHJpeCI6eyJzd2l0Y2giOjF9fX0.u05NTZ3SsHRMJi3yLJ9U5lELwk7qfDuqBp12jmVP_Vs"

        const firstChr = new RegExp("^[A-Za-z]")
        const otherpattern = new RegExp("[`~!@#$^&*()=|{}':;'\\[\\]<>/?~！@#￥……&*（）——|{}【】‘；：”“'% - \\s \\.]");
        let checkStrictName = true
        let checkOrder = false

        if (this.inputProjectName.match(firstChr) === null) {

            const h = this.$createElement;
            this.$message({
                type: 'error',
                message: h('h3', { style: 'color:#F56C6C;' }, "專案名稱開頭須為英文字母 (A-Z, a-z)"),
            })

            checkStrictName = false
            checkOrder = true
        }
        if (this.inputProjectName.match(otherpattern) !== null && checkOrder === false) {

            const h = this.$createElement;
            this.$message({
                type: 'error',
                message: h('h3', { style: 'color:#F56C6C;' }, "請勿輸入特殊字元"),
            })

            checkStrictName = false
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
        } else {
            this.inputProjectName = '';
            this.inputSolutionKey = '';
            this.openDialogMessage = false;
        }


    }

}