import { AugmentationPara, PreprocessPara } from '@/io/experiment';

export class dialogDataExperiment {
    open = false;
    title = '';
    experimentId = '';
    default!: AugmentationPara | PreprocessPara;
}