export class RemoveProjectReq {
    projectName!: string
}

export class RemoveProjectRes {
    code = 0;
    message = '';
    data?: ProjectResData;
}

export class ProjectResData {
    projects: string[] = [];
}