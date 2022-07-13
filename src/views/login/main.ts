import { Component, Vue } from 'vue-property-decorator';
import Logger from '@/services/log.service';


@Component
export default class Login extends Vue {

    private rightBoxDisplay = 'login';

    // for login
    private loginContent = {
        account: '',
        password: '',
        rememberChecked: false,
    };

    // for create account
    private createContent = {
        name: '',
        department: '',
        account: '',
        password: '',
        agreeChecked: false,
    };

    // for forget password
    private sendEmail = '';

    // for reset password
    private ressetPassword ={
        account:'',
        password:'',
        passwordAgain:'',
        rememberChecked:false,
    }


    private handleLogin(content: {
        account: string,
        password: string,
        rememberChecked: boolean
    }): void {

        Logger.log("test", content)
        this.$router.push('/')
    }

    private handleCreateAccount(content: {
        name: string,
        department: string,
        account: string,
        password: string,
        agreeChecked: boolean
    }): void {
        Logger.log("test", content)
        this.$router.push('/')
    }

    private handleSendToEmail(email:string):void{
        Logger.log("mail",email)
        this.rightBoxDisplay = 'resetPassword'
    }

    private handleResetPassword(content:{
        account:string,
        password:string,
        passwordAgain:string,
        rememberChecked:boolean
    }):void{
        Logger.log("test", content)
        this.$router.push('/')
    }

}