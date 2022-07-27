
export class LoginReq {
    username!: string;
    password!: string;
}

export class LoginRes {
    code = 0;
    message = '';
    data?: string;
}