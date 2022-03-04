import { Component, Prop, Vue } from 'vue-property-decorator';
import Store from '@/services/store.service';


@Component
export default class DialogProjectCreate extends Vue {
  @Prop() private dialogOpen!: boolean;

  get openDialogPojectCreate(){
    return this.dialogOpen
  }
  mounted(){
    console.log("store DialogProjectCreate",Store.clickCreateProject)
  }

}