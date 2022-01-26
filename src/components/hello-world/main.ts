import { Component, Prop, Vue } from 'vue-property-decorator';
import { ProtoService } from '../../services/proto.service';

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;
  private helloMsg: string = '';
  private name: string = '';

  private testing() {
    ProtoService.connect();
    ProtoService.sayHello(this.name).then((value) => this.helloMsg = value);
  }
}