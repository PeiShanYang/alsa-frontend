import { ConfigType } from '@/io/experimentConfig';
import Api from '@/services/api.service';
import store from '@/services/store.service';
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

  private get configs(): Map<string, Map<string, ConfigType>> {
    if (store.experimentConfigs) return store.experimentConfigs.ConfigPreprocess.PreprocessPara
    return new Map<string, Map<string, ConfigType>>()
  }

  private optionName(name: string): string {
    return this.$i18n.t(name).toString();
  }
}