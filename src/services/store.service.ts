import Vue from 'vue';
import { Project } from "@/io/project";
import { ExperimentConfigs } from '@/io/experimentConfig';

class Store {
  currentProject?: string;
  projectList: Map<string, Project> = new Map<string, Project>();

  experimentConfigs?: ExperimentConfigs;

  sidebarCollapse = false;
  debugMode = false
}

export default Vue.observable<Store>({
  projectList: new Map<string, Project>(),
  sidebarCollapse: false,
  debugMode: true,
});