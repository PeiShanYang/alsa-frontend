
export class ChangePasswordReq {
    originPassword!:string;
    password!: string;
}

export class ChangePasswordRes {
    code = 0;
    message = '';
    data?: string;
}
