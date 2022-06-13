export class RemoveFolderReq {
    root!: string;
    dir!: string;
}

export class RemoveFolderRes {
    code: number = 0;
    message: string = "";
}
