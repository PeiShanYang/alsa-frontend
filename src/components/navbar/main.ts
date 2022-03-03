import { Component, Vue } from 'vue-property-decorator';


@Component
export default class Navbar extends Vue {
  get projectName() {
    return this.$route.params.projectName;
  }

  get currentComponent() {
    console.log("thsi",this.$route)
    return this.$route.name ?? '';
  }
}