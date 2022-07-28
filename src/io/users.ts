export class UsersGlobal {
    users: string[] = [];
    maintainers: string[] = [];
}

export class UsersProject {
    users: string[] = [];
    members:Map<string,string> = new Map<string,string>()
}

export class UserInfo{
    token = '';
    username = '';
    auth = '';
}