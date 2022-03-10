import Vue from 'vue';
import { Project } from "@/io/project";

class Store {
  currentProject?: string;
  projectList: Map<string, Project> = new Map<string, Project>();
}

export default Vue.observable<Store>({
  projectList: new Map<string, Project>(),
});