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
      "key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDb25maWciOnsiZGF0YXNldFBhdGgiOiIifSwiQ29uZmlnUHJlcHJvY2VzcyI6eyJQcmVwcm9jZXNzUGFyYSI6eyJpbWFnZVNpemUiOlsyMjQsMjI0XSwibm9ybWFsaXplIjp7InN3aXRjaCI6MSwibW9kZSI6NCwibWVhbiI6WzAuNDkwMDI5MjksMC40OTAwMjkyOSwwLjQ5MDAyOTI5XSwic3RkIjpbMC4yNjE4NDYxMywwLjI2MTg0NjEzLDAuMjYxODQ2MTNdfSwiYnJpZ2h0bmVzcyI6MCwiYmx1ciI6MCwiY3V0bWl4IjowLCJtb3NhaWMiOjB9fSwiQ29uZmlnQXVnbWVudGF0aW9uIjp7IkF1Z21lbnRhdGlvblBhcmEiOnsicmFuZG9tSG9yaXpvbnRhbEZsaXAiOnsic3dpdGNoIjoxLCJwcm9iYWJpbGl0eSI6MC41fSwicmFuZG9tVmVydGljYWxGbGlwIjp7InN3aXRjaCI6MCwicHJvYmFiaWxpdHkiOjAuNX19fSwiQ29uZmlnTW9kZWxTZXJ2aWNlIjp7Ikxvc3NGdW5jdGlvblBhcmEiOnsibG9zc0Z1bmN0aW9uIjoiQ3Jvc3NFbnRyb3B5TG9zcyJ9LCJMZWFybmluZ1JhdGUiOnsibGVhcm5pbmdSYXRlIjowLjAxfSwiT3B0aW1pemVyUGFyYSI6eyJTR0QiOnsic3dpdGNoIjowLCJtb21lbnR1bSI6MC45LCJkYW1wZW5pbmciOjAsIndlaWdodERlY2F5IjowLjAwMDUsIm5lc3Rlcm92IjowfSwiQWRhbSI6eyJzd2l0Y2giOjEsImJldGFzIjpbMC45LDAuOTk5XSwiZXBzIjoxZS04LCJ3ZWlnaHREZWNheSI6MC4wMDA1LCJhbXNncmFkIjowfSwiQWRhZGVsdGEiOnsic3dpdGNoIjowLCJyaG8iOjAuOSwiZXBzIjowLjAwMDAwMSwid2VpZ2h0RGVjYXkiOjB9LCJBZGFtVyI6eyJzd2l0Y2giOjAsImJldGFzIjpbMC45LDAuOTk5XSwiZXBzIjoxZS04LCJ3ZWlnaHREZWNheSI6MC4wMSwiYW1zZ3JhZCI6MH0sIk5BZGFtIjp7InN3aXRjaCI6MCwiYmV0YXMiOlswLjksMC45OTldLCJlcHMiOjFlLTgsIndlaWdodERlY2F5IjowLCJtb21lbnR1bURlY2F5IjowLjAwNH19LCJTY2hlZHVsZXJQYXJhIjp7InN0ZXBMUiI6eyJzd2l0Y2giOjEsInN0ZXBfc2l6ZSI6MSwiZ2FtbWEiOjAuNX0sImNvc2luZUFubmVhbGluZ0xSIjp7InN3aXRjaCI6MCwiZXRhX21pbiI6MH19fSwiQ29uZmlnUHl0b3JjaE1vZGVsIjp7IlNlbGVjdGVkTW9kZWwiOnsibW9kZWwiOnsic3RydWN0dXJlIjoicmVnbmV0X3lfNDAwbWYiLCJwcmV0cmFpbmVkIjoxfX0sIkNsc01vZGVsUGFyYSI6eyJjdWRhRGV2aWNlIjoxLCJiYXRjaFNpemUiOjgsImVwb2NocyI6Mn19LCJDb25maWdQb3N0cHJvY2VzcyI6eyJQb3N0UHJvY2Vzc1BhcmEiOnsiY29uZmlkZW5jZUZpbHRlciI6eyJzd2l0Y2giOjEsInRocmVzaG9sZCI6MC44LCJzZWxlY3RMYWJlbCI6Ik9LIiwiY2xhc3NMaXN0IjpbIkFVMDIiLCJFTjAxIiwiRU4wMiIsIkVOMDMiLCJJVDQzIiwiT0siLCJTTTAwLk9UMDgiLCJTTTAzLlNNMDciLCJTTTA0IiwiU00wNSJdfX19LCJDb25maWdFdmFsdWF0aW9uIjp7IkV2YWx1YXRpb25QYXJhIjp7InNob3dBY2MiOjEsInNob3dDbGFzc0FjYyI6MSwic2hvd051bU9mQ2xhc3NlcyI6MCwic2hvd1JhdGUiOnsic3dpdGNoIjoxLCJ0YXJnZXRJbmRleCI6Ik9LIn0sInNob3dXcm9uZ0ZpbGUiOjB9fSwiQ29uZmlnUmVzdWx0U3RvcmFnZSI6eyJSZXN1bHRTdG9yYWdlIjp7InNhdmVGaW5hbFdlaWdodCI6MCwic2F2ZUNoZWNrcG9pbnQiOnsic3dpdGNoIjowLCJzYXZlSXRlciI6MX0sInNhdmVBY2NUeHQiOjEsImRyYXdBY2NDdXJ2ZSI6MSwiZHJhd0NvbmZ1c2lvbk1hdHJpeCI6MX19fQ.eyH5CBcWc4tHjV2xVm3vWj4T9LF1p3__fQosQF2RWsQ",
    };
    const response: AxiosResponse<GetProjectRes> = await axios.post(
      host + 'create-project-by-key',
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
