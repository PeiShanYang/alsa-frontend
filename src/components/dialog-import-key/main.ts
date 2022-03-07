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
  createProjectByKey() {

    if (this.inputProjectName !== "" && this.inputSolutionKey !== "") {
      Api.createProject(this.inputProjectName, this.inputSolutionKey)

      console.log("test", Store.projectList)
      this.$forceUpdate();
      this.$router.push({ name: 'experiments', params: { projectName: "Default Project" } })
    }

    this.inputProjectName = '';
    this.inputSolutionKey = '';


    return
  }
}