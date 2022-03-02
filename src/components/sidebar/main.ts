import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
// import { ProtoService } from '../../services/proto.service';

@Component
export default class Sidebar extends Vue {
  @Prop() private projectName!: string;

  private projectList: Array<string> = [];

  private projectMenu: Array<{ projectName: string, content: Array<{title:string,link:string}> }> = [];
  private searchProject = '';
  private nameSelect = "";

  created() {

    this.getProjectList();

    this.projectMenu = this.projectList.map( name =>{
      return {
        projectName : name,
        content : [
          {
            title: "Dataset",
            link: `/${name}/dataset`
          },
          {
            title: "Experiments",
            link: `/${name}/experiments`
          },
          {
            title: "Models",
            link: `/${name}/models`
          },
        ],
      }
    })


  }

  private getProjectList(): void {
    this.projectList = ["project01", "project02", "project03"]
  }

  // @Emit("project-name-pass")
  // handleSelect(projectName:string) {
  //   console.log("key",projectName)
  //   // console.log("keypath",keyPath)
  //   return projectName;
  // }

  // private handleSelect(key:string,keyPath:string): void{
  //   console.log("key",key)
  //   console.log("keypath",keyPath[0])
  //   this.nameSelect = keyPath[0]
  // }



}