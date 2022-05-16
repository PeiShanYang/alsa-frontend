import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component
export default class DialogModelDownload extends Vue {
  @Prop() private dialogOpen!: boolean;
  private inputFileName = '';


  @Emit("cancel-download")
  cancelDownloadModel() {

    this.inputFileName = '';

    return;
  }

  @Emit("confirm-download")
  confirmDownloadModel() {

    const firstChr = new RegExp("^[A-Za-z]")
    const otherpattern = new RegExp("[`~!@#$^&*()=|{}':;'\\[\\]<>/?~！@#￥……&*（）——|{}【】‘；：”“'% - \\s \\.]");
    let checkStrictName = true
    let fileName = ''


    if (this.inputFileName.match(firstChr) === null) {
      alert("error with first input char")
      checkStrictName = false
    }
    if (this.inputFileName.match(otherpattern) !== null) {
      alert("error with illegal char")
      checkStrictName = false
    }

    if (checkStrictName === true && this.inputFileName !== "") fileName = this.inputFileName

    this.inputFileName = '';

    return fileName

  }
}