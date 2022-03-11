import ProcessCellData from '@/io/processCellData';
import { VueShape } from '@antv/x6-vue-shape';
import { Cell } from '@antv/x6/lib/model/cell';
import { Component, Prop, Inject, Vue } from 'vue-property-decorator';

@Component
export default class flowNode extends Vue {

  @Prop(String) private icon!: string;
  @Prop(String) private title!: string;
  @Prop(String) private backgroundColor!: string;
  @Prop(String) private borderColor!: string;

  @Inject("getNode") private getNode!: () => VueShape;

  private nodeBackgroundColor = `background: ${this.backgroundColor}`;
  private nodeBorderColor = `border-color: ${this.borderColor}; border-left:2px solid ${this.borderColor};`;
  private nodeContent = "暫無資料"

  mounted(): void {
    const node = this.getNode();
    console.log("node flow",node.getData())
    this.nodeContent = node.getData().content

    // node.on("change:data", (info: Cell.ChangeArgs<ProcessCellData>)=>{
    //   console.log("changed",info);
    // });
  }
}