import { LineOptions, RingProgressOptions } from "@antv/g2plot";

export default class ChartService {


    static getLineChartOption(screenWidth: number): Partial<LineOptions> {
        return {
            height: screenWidth * 0.1,
            appendPadding: 8,
            xField: "epoch",
            yField: 'accuracy',
        }
    }



    static readonly RingColorSetting = [
        { name: 'accuracy', title: "Accuracy", color: ['#0E5879', '#E6E1E1'] },
        { name: 'precision', title: "Precision", color: ['#0E5879', '#E6E1E1'] },
        { name: 'recall', title: "Recall", color: ['#1380B1', '#E6E1E1'] },
        { name: 'f1scroe', title: "F1-score", color: ['#93E523', '#E6E1E1'] },
    ];

    static getRingChartOption(screenWidth: number, percent: number, title: string): Partial<RingProgressOptions> {

        const getColorSetting = ChartService.RingColorSetting.filter(item => item.name === title)
        const getColor = getColorSetting[0].color
        const showTitle = getColorSetting[0].title
        const showPrecent = (percent * 100).toFixed(1)
        return {
            height: screenWidth * 0.1,
            radius: 1,
            innerRadius: 0.75,
            color: getColor,
            statistic: {
                title: false,
                content: {
                    customHtml: () => {
                        return `
                                <div>
                                    <div style='font-size:${screenWidth * 0.0015}em;line-height: initial;'>${showPrecent}%</div>
                                    <div style='font-size:${screenWidth * 0.0005}em;'>${showTitle}</div>    
                                </div>
                                `
                    }
                }
            }

        }
    }
}
