import { Component, Prop, Vue } from 'vue-property-decorator';


@Component
export default class Sidebar extends Vue {
  @Prop() private msg!: string;
  private helloMsg = '';
  private name = '';

}