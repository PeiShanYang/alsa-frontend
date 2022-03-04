import Api from '@/services/api.service';
import Store from "@/services/store.service";
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Sidebar extends Vue {
  private searchProject = '';

  created(): void {
    Api.getProjectList();
  }

  get projectList(): Array<string> {
    return Store.projectList;
  }
}