import ProcessCell from '@/io/processCell';
import { VueShape } from '@antv/x6-vue-shape';
import { Cell } from '@antv/x6/lib/model/cell';
import { Component, Prop, Inject, Vue } from 'vue-property-decorator';

@Component
export default class flowNode extends Vue {

  // @Inject() getGraph: any;
  // @Inject() getNode: any;

  @Prop(String) private nodeIcon!: any;
  @Prop(String) private nodeTitle!: string;
  @Prop(String) private nodeContent!: any;
  @Prop(String) private nodeBackgroundColor!: string;
  @Prop(String) private nodeBorderColor!: string;

  @Inject("getNode") private node!: () => VueShape;

  
  private imgSrc = this.nodeIcon;
  private title: string = this.nodeTitle;
  // private content: string = this.nodeContent;

  private backgroundColor = `background: ${this.nodeBackgroundColor}`;
  private borderColor = `border-color:${this.nodeBorderColor}`;

  private num = 0;

  mounted(): void {

    const testnode = this.node()

    testnode.on("change:data",(info: Cell.ChangeArgs<ProcessCell>)=>{
      this.num = info.current?.num ?? 0;
    })

  }

}