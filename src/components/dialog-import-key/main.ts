import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import Api from '@/services/api.service';
import Store from '@/services/store.service';


@Component
export default class DialogImportKey extends Vue {
  @Prop() private dialogOpen!: boolean;
  private inputProjectName = '';
  private inputSolutionKey = '';


  @Emit("import-cancel")
  closeDialogImportKey() {

    this.inputProjectName = '';
    this.inputSolutionKey = '';

    return;
  }

  @Emit("import-confirm")
  async createProjectByKey() {

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
        Store.projectList.entries()
      ).forEach((project) => {
        if (project[0].includes(this.inputProjectName)) {
          this.$router.push({ name: 'experiments', params: { projectName: this.inputProjectName } })
        }
      })
    }

    this.inputProjectName = '';
    this.inputSolutionKey = '';

    return
  }
}