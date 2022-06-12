export class RenameFolderReq {
    root!: string;
    src!: string;
    dst!:string;
}

export class RenameFolderRes {
    code: number = 0;
    message: string = "";
}
