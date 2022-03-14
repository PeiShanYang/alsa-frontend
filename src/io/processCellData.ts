import { Experiment } from "@/io/experiment";

export default class ProcessCellData {
    component!: string;
    content!: string[];

    static cellDataContent(experiment: Experiment): Map<string, ProcessCellData> {
        return new Map([
            ['dataset-node', {
                component: 'dataset-node',
                content: [],
            }],
            ['preprocess-node', {
                component: 'preprocess-node',
                content: [],
            }],
            ['data-argument-node', {
                component: 'data-argument-node',
                content: [],
            }],
            ['model-select-node', {
                component: 'model-select-node',
                content: [],
            }],
            ['validation-select-node', {
                component: 'validation-select-node',
                content: [],
            }],
            ['trained-result-node', {
                component: 'trained-result-node',
                content: [],
            }],
            ['test-result-node', {
                component: 'test-result-node',
                content: [],
            }],
        ]);
    }

}