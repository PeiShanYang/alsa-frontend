import { Component, Prop, Vue, Emit } from 'vue-property-decorator';


@Component
export default class DialogPreprocess extends Vue {
  @Prop() private dialogOpen!: boolean;

  get openDialogPreprocess():boolean  {
    return this.dialogOpen
  }

  set openDialogPreprocess(value: boolean) {
    this.closeDialogPreprocess()
  }

  @Emit("dialog-close")
  closeDialogPreprocess() :boolean {
    return false;
  }

  private preprocessItem: Array<{ title: string, content?: any }> = [
    {
      title: "Resize", content: [
        {
          'name': "長",
          'number': 0,
          'unit': "px",
        },
        {
          'name': "寬",
          'number': 0,
          'unit': "px",
        }
      ]
    },
    {
      title: "灰階處理", content: [
        {
          'name': "Red",
          'number': 0.587,
        },
        {
          'name': "Green",
          'number': 0.299,
        },
        {
          'name': "Blue",
          'number': 0.114,
        },
      ]
    },
    { title: "曝光度" },
    { title: "尺度變換" },
    { title: "模糊" },
    { title: "亮度" },
    { title: "旋轉" },
    { title: "鏡射" },
    { title: "飽和度" },
    { title: "彩度" },
    { title: "冷/暖色度" },
    { title: "邊緣銳化" },
    { title: "通道變換" },
    { title: "單通道增強" },
    { title: "Cutmix" },
  ]

  private currentPage = 1;
  private pageSize = 12;
  private pagerCount = 3;
  private imageList: Array<{ name: string }> = [];


  created():void {
    this.handleImageList()
  }

  private handleCurrentChange(currentPage: number): void {
    this.currentPage = currentPage
  }

  private handleImageList(): void {
    const list: Array<{ name: string }> = [];
    for (let x = 0; x < 49; x++) {
      list[x] = { name: `${x + 1}. cam_image${x + 1}` };
    }
    this.imageList = list
  }

}