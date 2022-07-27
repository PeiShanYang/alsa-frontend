export class SetProjectUserReq {
    projectName!: string;
    username!: string;
    auth!: string;
}

export class SetProjectUserRes {
    code = 0;
    message = '';
    data? = '';
}
