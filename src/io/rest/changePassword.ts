
export class ChangePasswordReq {
    password!: string;
}

export class ChangePasswordRes {
    code = 0;
    message = '';
    data?: string;
}
