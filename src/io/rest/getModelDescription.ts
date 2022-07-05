export class GetModelDescriptionRes {
    code = 0;
    message = '';
    data?: Map<string,GetModelDescriptionResData>
}

export class GetModelDescriptionResData{
    dataNeeded = "";
    easeOfUsage = "";
    introduction = "";
    trainSpeed = "";
}