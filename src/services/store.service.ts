import Vue from 'vue';
import { Project } from "@/io/project";
import { ExperimentConfigs } from '@/io/experimentConfig';
import { UserInfo } from '@/io/users';

class Store {
  currentProject?: string;
  projectList: Map<string, Project> = new Map<string, Project>();

  experimentConfigs?: ExperimentConfigs;

  sidebarCollapse = false;
  debugMode = false;
  userInfo: UserInfo = new UserInfo()
}

export default Vue.observable<Store>({
  projectList: new Map<string, Project>(),
  sidebarCollapse: false,
  debugMode: true,
  userInfo: new UserInfo(),
});