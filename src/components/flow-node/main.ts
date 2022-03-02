import { Component, Prop, Inject, Vue } from 'vue-property-decorator';

@Component
export default class flowNode extends Vue {

  // @Inject() getGraph: any;
  // @Inject() getNode: any;

  @Prop(String) private nodeIcon!: string;
  @Prop(String) private nodeTitle!: string;
  @Prop(String) private nodeContent!: string;
  @Prop(String) private nodeBackgroundColor!: string;
  @Prop(String) private nodeBorderColor!: string;

  private imgSrc: string = this.nodeIcon;
  private title: string = this.nodeTitle;
  private content: string = this.nodeContent;
  private backgroundColor =`background: ${this.nodeBackgroundColor}`;
  private borderColor = `border-color:${this.nodeBorderColor}`;

}