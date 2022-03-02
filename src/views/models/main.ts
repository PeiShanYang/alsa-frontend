import { Component, Prop, Vue } from 'vue-property-decorator';

import Sidebar from "@/components/sidebar/Sidebar.vue";
import Navbar from '@/components/navbar/Navbar.vue';
import FooterInfo from '@/components/footer-info/FooterInfo.vue';


@Component({
  components: {
    "sidebar": Sidebar,
    "navbar": Navbar,
    "footer-info": FooterInfo,
  }
})
export default class Models extends Vue {

}