import { ConfigType } from '@/io/experimentConfig';
import Api from '@/services/api.service';
import store from '@/services/store.service';
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component
export default class DialogModelSelect extends Vue {
  @Prop() private dialogOpen!: boolean;

  @Emit("dialog-close")
  closeDialogModelSelect():void {
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

    console.log("this.configs",this.configs)

  }

  private optionName(name: string): string {
    return this.$i18n.t(name).toString();
  }
  
  private innerVisible  = false;

  private modelSelectItem: Array<{ title: string, describe: string, contentSetting:boolean, content?: any }> = [
    {
      title: "雙金字塔架構之一階段偵測模型 (AUO)",
      describe: "多尺度預測、二元損失函數、高效率",
      contentSetting: false,
    },
    {
      title: "三金字塔架構之一階段偵測模型 (AUO)",
      describe: "多尺度採樣、特徵融合、tanh 函數改良",
      contentSetting: false,
    },
    {
      title: "使用聚焦損失函數於一階段偵測模型 (RetinaNet)",
      describe: "多尺度預測、二元損失函數、高效率",
      contentSetting: false,
    },
    {
      title: "使用選擇性搜尋於雙階段偵測模型 (AUO)",
      describe: "多尺度預測、二元損失函數、高效率",
      contentSetting: false,
    },
    {
      title: "ROI 池化架構之雙階段偵測模型 (Fast R-CNN)",
      describe: "關注區域池化、標記區域回歸、類神經特徵提取",
      contentSetting: false,
    },
    {
      title: "候選區域網路連結雙階段偵測模型 (AUO)",
      describe: "關注區域池化、高效率、候選框提取",
      contentSetting: false,
    },
    {
      title: "基於注意力機制之編碼解碼偵測模型 (AUO)",
      describe: "注意力機制、編碼解碼架構、神經網路",
      contentSetting: false,
    },
    {
      title: "基於注意力機制之多尺度編碼解碼偵測模型 (AUO)",
      describe: "注意力機制、編碼解碼架構、多尺度偵測",
      contentSetting: false,
    },
  ]



}