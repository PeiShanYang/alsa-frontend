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
    return;
  }

  @Emit("import-confirm")
  async createProjectByKey() {

    const firstChr = new RegExp("^[A-Za-z]")
    const otherpattern = new RegExp("[`~!@#$^&*()=|{}':;'\\[\\]<>/?~！@#￥……&*（）——|{}【】‘；：”“'% - \\s \\.]");

    if (this.inputProjectName.match(firstChr) === null) alert("error with first input char")
    if (this.inputProjectName.match(otherpattern) !== null) alert("error with illegal char")


    if (this.inputProjectName !== "" && this.inputSolutionKey !== "") {

      await Api.createProjectByKey(this.inputProjectName, this.inputSolutionKey)

      this.$router.push({ name: 'experiments', params: { projectName: this.inputProjectName } })
    }

    this.inputProjectName = '';
    this.inputSolutionKey = '';

    return
  }
}