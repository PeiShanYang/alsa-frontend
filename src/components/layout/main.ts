import { Component, Prop, Vue } from 'vue-property-decorator';

import Sidebar from "@/components/sidebar/Sidebar.vue";
import Navbar from '@/components/navbar/Navbar.vue';


@Component({
  components: {
    "sidebar": Sidebar,
    "navbar": Navbar,
  }
})


export default class Layout extends Vue {

  get routeName(){
    console.log("this.$route.path",this.$route.path)
    return this.$route.path;
  }

}