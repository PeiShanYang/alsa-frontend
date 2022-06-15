import { ConfigType } from '@/io/experimentConfig';
import Api from '@/services/api.service';
import store from '@/services/store.service';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import OptionForm from '@/components/options/option-form/main';


@Component({
  components: {
    OptionForm
  }
})
export default class DialogPreprocess extends Vue {
  @Prop() private dialogOpen!: boolean;

  @Emit("dialog-close")
  closeDialogPreprocess(): void {
    return
  }

  private configs = new Map<string, Map<string, ConfigType>>()
  private resizeCheck = []
  private colorPick = 'rgb(255,255,255,1)';

  mounted(): void {
    this.waitConfigsSetting()
  }

  private async waitConfigsSetting():Promise<void>{
    if (!store.experimentConfigs) await Api.getExperimentConfigs()
    
    if (store.experimentConfigs) this.configs =  store.experimentConfigs.ConfigPreprocess.PreprocessPara

    // console.log("this.configs",this.configs)

  }

  private optionName(name: string): string {
    return this.$i18n.t(name).toString();
  }
}