import { Component, Vue } from 'vue-property-decorator';
import Logger from '@/services/log.service';
import Api from '@/services/api.service';
import storeService from '@/services/store.service';


@Component
export default class Login extends Vue {

    private rightBoxDisplay = 'login';
    private errorMsg = ''

    // for login
    private loginContent = {
        username: '',
        password: '',
        remember: false,
    };

    private async handleLogin(content: { username: string, password: string, remember: boolean }): Promise<void> {

        const res = await Api.login(content.username, content.password, content.remember)

        if (res === "success") {
            this.$router.push('/')
        } else {
            this.errorMsg = res
        }

    }

}