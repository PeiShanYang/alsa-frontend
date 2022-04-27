import { Component, Vue } from 'vue-property-decorator';
import { Line, Pie } from '@antv/g2plot';

@Component
export default class Models extends Vue {

    private resultExit = true;
    private acitveResultCollapse = ["1"];
    private data = [
        { epoch: '1', accuracy: 0.2 },
        { epoch: '2', accuracy: 0.2 },
        { epoch: '3', accuracy: 0.4 },
        { epoch: '4', accuracy: 0.75 },
        { epoch: '5', accuracy: 0.75 },
        { epoch: '6', accuracy: 0.75 },
        { epoch: '7', accuracy: 0.85 },
        { epoch: '8', accuracy: 0.85 },
        { epoch: '9', accuracy: 0.9 },
        { epoch: '10', accuracy: 0.9 },
    ];

    private plot_data_1 = [{ type: "fail", value: 3 }, { type: 'success', value: 97 }]

    mounted(): void {

        const windowWidth = window.innerWidth*0.19

        const linePlot = new Line(document.getElementById("chart")!, {
            height:windowWidth,
            data: this.data,
            xField: "epoch",
            yField: 'accuracy',
            appendPadding: 16,
        });

        linePlot.render();

        const plot_1 = new Pie(document.getElementById("plot_1")!, {
            height:windowWidth,
            data: this.plot_data_1,
            angleField : 'value',
            colorField: 'type',
            radius : 1,
            innerRadius : 0.75,
            color: ['#E6E1E1','#0E5879'],
            label:false,
            legend:false,
            statistic:{
                title:false,
                content:{
                    offsetY:0,
                    style:{fontWeight:200},
                    customHtml:()=>{
                        const calculateResult = '97.3%'
                        return `<div>
                            <div style='font-size:1em'>${calculateResult}</div>
                            <div style='font-size:0.3em;margin:5px'>Precision</div>
                            <div style='font-size:0.3em'>97 / 100 張</div>
                        </div>`
                    },
                }
            }

        })
        plot_1.render()

        const plot_2 = new Pie(document.getElementById("plot_2")!, {
            height:windowWidth,
            data: this.plot_data_1,
            angleField : 'value',
            colorField: 'type',
            radius : 1,
            innerRadius : 0.75,
            color: ['#E6E1E1','#1380B1'],
            label:false,
            legend:false,
            statistic:{
                title:false,
                content:{
                    offsetY:0,
                    style:{fontWeight:200},
                    customHtml:()=>{
                        const calculateResult = '95.3%'
                        return `<div>
                            <div style='font-size:1em'>${calculateResult}</div>
                            <div style='font-size:0.3em;margin:5px'>Recall</div>
                            <div style='font-size:0.3em'>95 / 100 張</div>
                        </div>`
                    },
                }
            }

        })
        plot_2.render()

        const plot_3 = new Pie(document.getElementById("plot_3")!, {
            height:windowWidth,
            data: this.plot_data_1,
            angleField : 'value',
            colorField: 'type',
            radius : 1,
            innerRadius : 0.75,
            color: ['#E6E1E1','#93E523'],
            label:false,
            legend:false,
            statistic:{
                title:false,
                content:{
                    offsetY:0,
                    style:{fontWeight:200},
                    customHtml:()=>{

                        const calculateResult = '96.3%'
                        return `<div>
                            <div style='font-size:1em'>${calculateResult}</div>
                            <div style='font-size:0.3em;margin:5px'>F1-score</div>
                        </div>`
                    },
                }
            }

        })
        plot_3.render()
    }
}