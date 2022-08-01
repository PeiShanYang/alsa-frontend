
export class AddUserReq {
    username!:string;
    password!: string;
    maintainer!:boolean;
}

export class AddUserRes {
    code = 0;
    message = '';
    data?: string;
}
