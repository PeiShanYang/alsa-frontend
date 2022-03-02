import { Component, Prop, Vue } from 'vue-property-decorator';


@Component
export default class Navbar extends Vue {
  // @Prop() private projectName!:string;
  // @Prop() private currentComponent!:string;
  private projectName = this.$route.params.projectName;
  private currentComponent = this.$route.name!;
  // private breadLink = "";

  // get projectName(){
  //   return this.routeName
  // }

  // get currentComponent(){
  //   return this.routeComponent
  // }
 
  // computed(){
  //   this.projectName = this.$route.params.projectName;
  //   this.currentComponent = this.$route.name!;
  // }
 
}