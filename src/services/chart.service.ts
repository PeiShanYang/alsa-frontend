import { LineOptions, RingProgressOptions } from "@antv/g2plot";

export default class ChartService {


    static getLineChartOption(screenWidth: number): Partial<LineOptions> {
        return {
            height: screenWidth * 0.1,
            appendPadding: 8,
            xField: "epoch",
            yField: 'accuracy',
            xAxis: {
                title: {
                    text: "Epoch",
                    style: {
                        fontSize: 20,
                    }
                },
            },
            yAxis: {
                title: {
                    text: "Accuracy",
                    style: {
                        fontSize: 20,
                    }
                },
            },
        }
    }


    static getRingChartOption(screenWidth: number, percent: number, title: string): Partial<RingProgressOptions> {

        const showPrecent = (percent * 100).toFixed(1)
        return {
            autoFit: true,
            radius: 1,
            innerRadius: 0.75,
            color: ['#0E5879', '#E6E1E1'],
            statistic: {
                title: false,
                content: {
                    customHtml: () => {
                        return `
                                <div>
                                    <div style='font-size:30px;line-height: initial;padding:5px 0'>${showPrecent}%</div>
                                    <div style='font-size:20px;'>${title}</div>    
                                </div>
                                `
                    }
                }
            }

        }
    }
}
