export class ListFolderRes {
    code = 0;
    message = '';
    data?: ListFolderResData[];
}

export class ListFolderResData {
    name = '';
    fullpath = '';
    children?: ListFolderResData[];
}