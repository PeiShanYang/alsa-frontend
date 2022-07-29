import FlowNodeSettings from '@/io/flowNodeSettings';
import ProcessCellData from '@/io/processCellData';
import { VueShape } from '@antv/x6-vue-shape';
import { Cell } from '@antv/x6/lib/model/cell';
import { Component, Inject, Vue } from 'vue-property-decorator';

@Component
export default class FlowNode extends Vue {

  @Inject("getNode") private getNode!: () => VueShape;

  private basic = new FlowNodeSettings()

  get nodeBackgroundColor(): string {
    return `background: ${this.basic.backgroundColor};border-color: ${this.basic.borderColor};opacity: ${this.basic.opacity};`
  }

  get nodeBorderColor(): string {
    return `border-color: ${this.basic.borderColor};opacity: ${this.basic.opacity};`;
  }

  private nodeContent: string[] = []


  mounted(): void {
    const node = this.getNode();

    this.basic = node.getData().basic

    this.nodeContent = node.getData().content

    node.on("change:data", (info: Cell.ChangeArgs<ProcessCellData>) => {

      if (info.current) {
        this.nodeContent = [...info.current.content]
        this.basic = { ...info.current.basic }
      }
    });

  }
}