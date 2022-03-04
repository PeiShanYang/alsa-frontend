import { Project } from '@/io/project';
import Api from '@/services/api.service';
import Store from "@/services/store.service";
import { Component, Vue } from 'vue-property-decorator';
import dashboardIcon from "@/asset/Forallvision_icon0304/bar_c_Create Project.svg"
@Component
export default class Sidebar extends Vue {
  private searchProject = '';

  created(): void {
    Api.getProjectList();
  }

  get projectList(): Project[] {
    if (this.searchProject === '') return Store.projectList;

    return Store.projectList.filter((value) => value.name?.toUpperCase().includes(this.searchProject.toUpperCase()));
  }
  createProject() : void{
    Store.clickCreateProject = true
    console.log("create",Store.clickCreateProject)
  }
}