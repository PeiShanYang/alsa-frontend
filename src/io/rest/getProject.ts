export class GetProjectRes {
  code = 0;
  message = '';
  data?: GetProjectResData;
}

export class GetProjectResData {
  projects: string[] = [];
}