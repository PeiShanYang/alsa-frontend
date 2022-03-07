import { Project } from '@/io/project';
import Api from '@/services/api.service';
import Store from "@/services/store.service";
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Sidebar extends Vue {
  private searchProject = '';
  private store = Store;
  // created(): void {
  //   Api.createProject();
  // }

  get projectList(): Project[] {
    console.log("projectlist",Store.projectList);
    if (this.searchProject === '') return Store.projectList;

    return this.store.projectList.filter((value) => value.name?.toUpperCase().includes(this.searchProject.toUpperCase()));
  }

}