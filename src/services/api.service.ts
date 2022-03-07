import { CreateProjectByKeyReq } from "@/io/rest/createProject";
import { GetProjectRes } from "@/io/rest/getProject";
import axios, { AxiosResponse } from "axios";
import store from "./store.service";

const host = 'http://tw100104318:57510/';

export default class Api {
  static async getProjects(): Promise<void> {
    const response = await axios.post(
      host + 'get-projects',
    );

    if (response.status !== 200) return;

    const res: GetProjectRes = response.data;
    if (res.code !== 0) {
      console.log(res.message);
      return;
    }

    if (res.data) {
      store.projectList = res.data.projects.map((projectName: string) => {
        return {name: projectName};
      });
    }
  }

  static async createProjectByKey(name: string, key: string): Promise<void> {
    const reqData: CreateProjectByKeyReq = {
      "name": name,
      "key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDb25maWcuZGF0YXNldFBhdGgiOiIiLCJDb25maWdQcmVwcm9jZXNzLlByZXByb2Nlc3NQYXJhLmltYWdlU2l6ZSI6WzIyNCwyMjRdLCJDb25maWdQcmVwcm9jZXNzLlByZXByb2Nlc3NQYXJhLm5vcm1hbGl6ZSI6eyJzd2l0Y2giOjEsIm1vZGUiOjQsIm1lYW4iOlswLjQ5MDAyOTI5LDAuNDkwMDI5MjksMC40OTAwMjkyOV0sInN0ZCI6WzAuMjYxODQ2MTMsMC4yNjE4NDYxMywwLjI2MTg0NjEzXX0sIkNvbmZpZ1ByZXByb2Nlc3MuUHJlcHJvY2Vzc1BhcmEuYnJpZ2h0bmVzcyI6MCwiQ29uZmlnUHJlcHJvY2Vzcy5QcmVwcm9jZXNzUGFyYS5ibHVyIjowLCJDb25maWdQcmVwcm9jZXNzLlByZXByb2Nlc3NQYXJhLmN1dG1peCI6MCwiQ29uZmlnUHJlcHJvY2Vzcy5QcmVwcm9jZXNzUGFyYS5tb3NhaWMiOjAsIkNvbmZpZ0F1Z21lbnRhdGlvbi5BdWdtZW50YXRpb25QYXJhLnJhbmRvbUhvcml6b250YWxGbGlwIjp7InN3aXRjaCI6MSwicHJvYmFiaWxpdHkiOjAuNX0sIkNvbmZpZ0F1Z21lbnRhdGlvbi5BdWdtZW50YXRpb25QYXJhLnJhbmRvbVZlcnRpY2FsRmxpcCI6eyJzd2l0Y2giOjAsInByb2JhYmlsaXR5IjowLjV9LCJDb25maWdNb2RlbFNlcnZpY2UuTG9zc0Z1bmN0aW9uUGFyYS5sb3NzRnVuY3Rpb24iOiJDcm9zc0VudHJvcHlMb3NzIiwiQ29uZmlnTW9kZWxTZXJ2aWNlLkxlYXJuaW5nUmF0ZS5sZWFybmluZ1JhdGUiOjAuMDEsIkNvbmZpZ01vZGVsU2VydmljZS5PcHRpbWl6ZXJQYXJhLlNHRCI6eyJzd2l0Y2giOjAsIm1vbWVudHVtIjowLjksImRhbXBlbmluZyI6MCwid2VpZ2h0RGVjYXkiOjAuMDAwNSwibmVzdGVyb3YiOjB9LCJDb25maWdNb2RlbFNlcnZpY2UuT3B0aW1pemVyUGFyYS5BZGFtIjp7InN3aXRjaCI6MSwiYmV0YXMiOlswLjksMC45OTldLCJlcHMiOjFlLTgsIndlaWdodERlY2F5IjowLjAwMDUsImFtc2dyYWQiOjB9LCJDb25maWdNb2RlbFNlcnZpY2UuT3B0aW1pemVyUGFyYS5BZGFkZWx0YSI6eyJzd2l0Y2giOjAsInJobyI6MC45LCJlcHMiOjAuMDAwMDAxLCJ3ZWlnaHREZWNheSI6MH0sIkNvbmZpZ01vZGVsU2VydmljZS5PcHRpbWl6ZXJQYXJhLkFkYW1XIjp7InN3aXRjaCI6MCwiYmV0YXMiOlswLjksMC45OTldLCJlcHMiOjFlLTgsIndlaWdodERlY2F5IjowLjAxLCJhbXNncmFkIjowfSwiQ29uZmlnTW9kZWxTZXJ2aWNlLk9wdGltaXplclBhcmEuTkFkYW0iOnsic3dpdGNoIjowLCJiZXRhcyI6WzAuOSwwLjk5OV0sImVwcyI6MWUtOCwid2VpZ2h0RGVjYXkiOjAsIm1vbWVudHVtRGVjYXkiOjAuMDA0fSwiQ29uZmlnTW9kZWxTZXJ2aWNlLlNjaGVkdWxlclBhcmEuc3RlcExSIjp7InN3aXRjaCI6MSwic3RlcF9zaXplIjoxLCJnYW1tYSI6MC41fSwiQ29uZmlnTW9kZWxTZXJ2aWNlLlNjaGVkdWxlclBhcmEuY29zaW5lQW5uZWFsaW5nTFIiOnsic3dpdGNoIjowLCJldGFfbWluIjowfSwiQ29uZmlnUHl0b3JjaE1vZGVsLlNlbGVjdGVkTW9kZWwubW9kZWwiOnsic3RydWN0dXJlIjoicmVnbmV0X3lfNDAwbWYiLCJwcmV0cmFpbmVkIjoxfSwiQ29uZmlnUHl0b3JjaE1vZGVsLkNsc01vZGVsUGFyYS5jdWRhRGV2aWNlIjoxLCJDb25maWdQeXRvcmNoTW9kZWwuQ2xzTW9kZWxQYXJhLmJhdGNoU2l6ZSI6OCwiQ29uZmlnUHl0b3JjaE1vZGVsLkNsc01vZGVsUGFyYS5lcG9jaHMiOjIsIkNvbmZpZ1Bvc3Rwcm9jZXNzLlBvc3RQcm9jZXNzUGFyYS5jb25maWRlbmNlRmlsdGVyIjp7InN3aXRjaCI6MSwidGhyZXNob2xkIjowLjgsInNlbGVjdExhYmVsIjoiT0siLCJjbGFzc0xpc3QiOlsiQVUwMiIsIkVOMDEiLCJFTjAyIiwiRU4wMyIsIklUNDMiLCJPSyIsIlNNMDAuT1QwOCIsIlNNMDMuU00wNyIsIlNNMDQiLCJTTTA1Il19LCJDb25maWdFdmFsdWF0aW9uLkV2YWx1YXRpb25QYXJhLnNob3dBY2MiOjEsIkNvbmZpZ0V2YWx1YXRpb24uRXZhbHVhdGlvblBhcmEuc2hvd0NsYXNzQWNjIjoxLCJDb25maWdFdmFsdWF0aW9uLkV2YWx1YXRpb25QYXJhLnNob3dOdW1PZkNsYXNzZXMiOjAsIkNvbmZpZ0V2YWx1YXRpb24uRXZhbHVhdGlvblBhcmEuc2hvd1JhdGUiOnsic3dpdGNoIjoxLCJ0YXJnZXRJbmRleCI6Ik9LIn0sIkNvbmZpZ0V2YWx1YXRpb24uRXZhbHVhdGlvblBhcmEuc2hvd1dyb25nRmlsZSI6MCwiQ29uZmlnUmVzdWx0U3RvcmFnZS5SZXN1bHRTdG9yYWdlLnNhdmVGaW5hbFdlaWdodCI6MCwiQ29uZmlnUmVzdWx0U3RvcmFnZS5SZXN1bHRTdG9yYWdlLnNhdmVDaGVja3BvaW50Ijp7InN3aXRjaCI6MCwic2F2ZUl0ZXIiOjF9LCJDb25maWdSZXN1bHRTdG9yYWdlLlJlc3VsdFN0b3JhZ2Uuc2F2ZUFjY1R4dCI6MSwiQ29uZmlnUmVzdWx0U3RvcmFnZS5SZXN1bHRTdG9yYWdlLmRyYXdBY2NDdXJ2ZSI6MSwiQ29uZmlnUmVzdWx0U3RvcmFnZS5SZXN1bHRTdG9yYWdlLmRyYXdDb25mdXNpb25NYXRyaXgiOjF9.utwO6RVjPzR47YP8bbjeij4CJTDHM0Oe8WyG3tgwgkY",
    };
    const response: AxiosResponse<GetProjectRes> = await axios.post(
      host + 'creat-project-by-key',
      reqData,
    );

    if (response.status !== 200) return;

    const res: GetProjectRes = response.data;
    if (res.code !== 0) {
      console.log(res.message);
      return;
    }

    if (res.data) {
      console.log(res.data)
      store.projectList = res.data.projects.map((projectName: string) => {
        return {name: projectName};
      });
    }
  }
}
