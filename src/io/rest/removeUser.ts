
export class RemoveUserReq {
    username!:string;
}

export class RemoveUserRes {
    code = 0;
    message = '';
    data?: string;
}
