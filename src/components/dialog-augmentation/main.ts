import { ConfigType } from '@/io/experimentConfig';
import Api from '@/services/api.service';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';


@Component
export default class DialogPreprocess extends Vue {
  @Prop() private dialogOpen!: boolean;


  @Emit("dialog-close")
  closeDialogPreprocess(): boolean {
    return false;
  }

  mounted(): void {

    Api.getExperimentConfigs()
    console.log("mounted")
  }
}