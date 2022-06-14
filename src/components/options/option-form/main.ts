import { ConfigType } from '@/io/experimentConfig';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component
export default class OptionForm extends Vue {
  @Prop() private config!: Map<string, ConfigType>;
  
  private create() {
    console.log(this.config);
  }
  // @Emit("confrim-action")
  // handleConfrimAction(): string {
  //   return this.messageData.content
  // }

}