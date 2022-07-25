import storeService from "@/services/store.service"
import { StringUtil } from "@/utils/string.util"


export class AxiosUtils {

    static bearearToken(): { headers: { Authorization: string } } {

        const token = StringUtil.getCookie('salaCookies') !== '' ? StringUtil.getCookie('salaCookies') : storeService.salaCookies

        return {
            headers: { Authorization: `Bearer ${token}` }
        }
    }

}