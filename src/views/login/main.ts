import { Component, Vue } from 'vue-property-decorator';


@Component
export default class Login extends Vue {

    private rememberChecked = false;
    private inputAccount = '';
    private inputPassword = '';

    private handleLogin(account:string,password:string,remember:boolean):void{
        
        console.log("test",account,password,remember)

        this.$router.push('/')
    }


}