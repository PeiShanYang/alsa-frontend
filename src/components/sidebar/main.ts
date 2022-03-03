import Api from '@/services/api.service';
import Store from "@/services/store.service";
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Sidebar extends Vue {
  private searchProject = '';
  private nameSelect = '';

  created() {
    Api.getProjectList();
  }

  get projectList() {
    return Store.projectList;
  }

  private getIndex(i: number, j: number): string {
    return `${i}-${j}`;
  }
}