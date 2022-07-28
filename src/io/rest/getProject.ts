export class GetProjectRes {
  code = 0;
  message = '';
  data?: GetProjectResData;
}

export class GetProjectResData {
  projects: Map<string, string> = new Map<string, string>()
}