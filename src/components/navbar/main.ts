import { Component, Vue } from 'vue-property-decorator';


@Component
export default class Navbar extends Vue {
  get projectName(): string {
    return this.$route.params.projectName;
  }

  get currentComponent(): string {
    return this.$route.name ?? '';
  }
}