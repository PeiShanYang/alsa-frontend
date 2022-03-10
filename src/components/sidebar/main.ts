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

  get projectList(): Map<string, Project> {
    if (this.searchProject === '') return store.projectList;

    return new Map<string, Project>(
      Array.from(
        store.projectList.entries()
      ).filter(
        (value) => value[0].toUpperCase().includes(
          this.searchProject.toUpperCase()
        )
      )
    );
  }
}