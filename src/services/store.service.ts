import Vue from 'vue';
import { Project } from "@/io/project";

class Store {
  projectList: Project[] = [];
}

export default Vue.observable<Store>({
  projectList: [],
});