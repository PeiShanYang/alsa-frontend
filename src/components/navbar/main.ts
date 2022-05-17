import { Component, Vue } from 'vue-property-decorator';
import store from "@/services/store.service";

@Component
export default class Navbar extends Vue {
  get projectName(): string {
    return this.$route.params.projectName;
  }

  get currentComponent(): string {
    return this.$route.name ?? '';
  }

  private handleCollapse():void{

    store.sidebarCollapse = !store.sidebarCollapse

  }

}