import { UserInfo } from "@/io/users";

export class RefreshTokenRes {
    code = 0;
    message = '';
    data?: UserInfo;
}