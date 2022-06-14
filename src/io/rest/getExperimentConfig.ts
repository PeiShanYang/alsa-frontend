import { ExperimentConfigs } from "../experimentConfig"

export class GetExperimentConfigsRes {
    code!: number
    message = ''
    data?: ExperimentConfigs
}