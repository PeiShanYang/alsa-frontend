import storeService from "@/services/store.service"
import { StringUtil } from "@/utils/string.util"


export class AxiosUtils {

    static getToken(): string {
        return StringUtil.getCookie('salaCookies') !== '' ? StringUtil.getCookie('salaCookies') : storeService.userInfo.token
    }

    static bearearToken(): { headers: { Authorization: string } } {

        const token = AxiosUtils.getToken()

        return {
            headers: { Authorization: `Bearer ${token}` }
        }
    }


}