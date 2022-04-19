import { Component, Vue } from 'vue-property-decorator';
import { Line } from '@antv/g2plot';

@Component
export default class Models extends Vue {

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

    mounted(): void {
        const linePlot = new Line(document.getElementById("chart")!,{
            data: this.data,
            xField:"epoch",
            yField:'accuracy',
        });
        // bar.chart.data(this.data)

        linePlot.render();
    }
}