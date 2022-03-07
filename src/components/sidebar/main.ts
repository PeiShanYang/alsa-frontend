import { Project } from '@/io/project';
import Api from '@/services/api.service';
import store from "@/services/store.service";
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Sidebar extends Vue {
  private searchProject = '';

  created(): void {
    Api.getProjects();
  }

  get projectList(): Project[] {
    console.log("projectlist", store.projectList);
    if (this.searchProject === '') return store.projectList;

    return store.projectList.filter((value) => value.name?.toUpperCase().includes(this.searchProject.toUpperCase()));
  }
}