import { UsersProject } from "@/io/users";

export class UsersProjectReq {
    projectName!:string;
}

export class UsersProjectRes {
    code = 0;
    message = '';
    data?:  UsersProject;
}
