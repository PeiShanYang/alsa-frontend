import { Experiment, EvaluationPara} from "@/io/experiment";
import GraphService from "@/services/graph.service";
import ProjectSevice from "@/services/project.service";
import FlowNodeSettings from "./flowNodeSettings";


export default class ProcessCellData {
    component!: string;
    content!: string[];
    basic!:FlowNodeSettings;

    static cellDataContent(experiment: Experiment, projectName: string): Map<string, ProcessCellData> {

        return new Map([
            ['dataset-node', {
                component: 'dataset-node',
                content: ProjectSevice.getDatasetNodeContent(experiment.Config.PrivateSetting.datasetPath ?? "", projectName),
                basic : GraphService.basicNodes.find(node => node.name === 'dataset-node') ?? new FlowNodeSettings()
            }],
            ['preprocess-node', {
                component: 'preprocess-node',
                content: Array.from(Object.keys(experiment.ConfigPreprocess.PreprocessPara)),
                basic : GraphService.basicNodes.find(node => node.name === 'preprocess-node') ?? new FlowNodeSettings()
            }],
            ['augmentation-node', {
                component: 'augmentation-node',
                content: Array.from(Object.keys(experiment.ConfigAugmentation.AugmentationPara)),
                basic : GraphService.basicNodes.find(node => node.name === 'augmentation-node') ?? new FlowNodeSettings()
            }],
            ['model-select-node', {
                component: 'model-select-node',
                content: ProjectSevice.getModelNodeContent(experiment.ConfigPytorchModel.SelectedModel.model),
                basic : GraphService.basicNodes.find(node => node.name === 'model-select-node') ?? new FlowNodeSettings()
            }],
            ['validation-select-node', {
                component: 'validation-select-node',
                content: Object.getOwnPropertyNames(new EvaluationPara),
                basic : GraphService.basicNodes.find(node => node.name === 'validation-select-node') ?? new FlowNodeSettings()
            }],
            ['trained-result-node', {
                component: 'trained-result-node',
                content: ["waiting"],
                basic : GraphService.basicNodes.find(node => node.name === 'trained-result-node') ?? new FlowNodeSettings()

            }],
            ['test-result-node', {
                component: 'test-result-node',
                content: ["waiting"],
                basic : GraphService.basicNodes.find(node => node.name === 'test-result-node') ?? new FlowNodeSettings()
            }],
        ]);
    }

}
