import { Component, Vue } from 'vue-property-decorator';


@Component
export default class Login extends Vue {

    private rightBoxDisplay = 'login';

    // for login
    private inputAccount = '';
    private inputPassword = '';
    private rememberChecked = false;
    
    // for create account
    

    private handleLogin(account:string,password:string,remember:boolean):void{
        
        console.log("test",account,password,remember)

        this.$router.push('/')
    }


}