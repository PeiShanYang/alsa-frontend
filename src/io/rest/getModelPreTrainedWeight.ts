export class GetModelPreTrainedWeightReq{
    model!:string;
}

export class GetModelPreTrainedWeightRes{
    code = 0;
    message = '';
    data?: boolean;
}