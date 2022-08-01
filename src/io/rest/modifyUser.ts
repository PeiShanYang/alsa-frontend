
export class ModifyUserReq {
    username!: string;
    isMaintainer!: boolean;
}

export class  ModifyUserRes {
    code = 0;
    message = '';
    data?: string;
}
