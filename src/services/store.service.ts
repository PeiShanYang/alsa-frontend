import Vue from 'vue';
import { Project } from "@/io/project";
import { DatasetStatus } from '@/io/dataset';

class Store {
  currentProject?: string;
  projectList: Map<string, Project> = new Map<string, Project>();
}

export default Vue.observable<Store>({
  projectList: new Map<string, Project>(),
});