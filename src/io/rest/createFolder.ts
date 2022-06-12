export class CreateFolderReq {
    root!: string;
    dir!: string;
}

export class CreateFolderRes {
    code: number = 0;
    message: string = "";
}
