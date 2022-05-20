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


    private async createProjectByKey(content: { inputName: string, inputContent: string }[]): Promise<void> {

        this.inputProjectName = content.find(item => item.inputName === "專案名稱")?.inputContent ?? ''
        this.inputSolutionKey = content.find(item => item.inputName === "請輸入您的解決方案金鑰")?.inputContent ?? ''

        const firstChr = new RegExp("^[A-Za-z]")
        const otherpattern = new RegExp("[`~!@#$^&*()=|{}':;'\\[\\]<>/?~！@#￥……&*（）——|{}【】‘；：”“'% - \\s \\.]");
        let checkStrictName = true

        if (this.inputProjectName.match(firstChr) === null) {
            alert("error with first input char")
            checkStrictName = false
        }
        if (this.inputProjectName.match(otherpattern) !== null) {
            alert("error with illegal char")
            checkStrictName = false
        }

        if (checkStrictName === true && this.inputProjectName !== "" && this.inputSolutionKey !== "") {

            await Api.createProjectByKey(this.inputProjectName, this.inputSolutionKey);

            Array.from(
                store.projectList.entries()
            ).forEach((project) => {
                if (project[0].includes(this.inputProjectName)) {
                    this.$router.push({ name: 'experiments', params: { projectName: this.inputProjectName } })
                }
            })
        }

        this.inputProjectName = '';
        this.inputSolutionKey = '';
        this.openDialogMessage = false;
    }

}