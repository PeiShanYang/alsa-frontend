export class GetProjectRes {
  code: number = 0;
  message: string = '';
  data?: GetProjectResData;
}

export class GetProjectResData {
  projects: string[] = [];
}