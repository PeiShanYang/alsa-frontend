import { Experiment } from "@/io/experiment";

export default class ProcessCellData {
    component!: string;
    content!: string[];

    static cellDataContent(experiment: Experiment): Map<string, ProcessCellData> {
        experiment;
        return new Map([
            ['dataset-node', {
                component: 'dataset-node',
                content: ["未上傳","未標記","未切分"],
            }],
            ['preprocess-node', {
                component: 'preprocess-node',
                content: ["資料正規化"],
            }],
            ['data-argument-node', {
                component: 'data-argument-node',
                content: ["隨機水平翻轉"],
            }],
            ['model-select-node', {
                component: 'model-select-node',
                content: ["友達經典多層模型"],
            }],
            ['validation-select-node', {
                component: 'validation-select-node',
                content: ["準確率","各類準確率"],
            }],
            ['trained-result-node', {
                component: 'trained-result-node',
                content: ["尚未訓練"],
            }],
            ['test-result-node', {
                component: 'test-result-node',
                content: ["尚未訓練"],
            }],
        ]);
    }

}