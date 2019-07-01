import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-base-chart',
  templateUrl: './base-chart.component.html',
  styleUrls: ['./base-chart.component.scss']
})
export class BaseChartComponent implements OnInit {

  @Input('pieChartColors') public pieChartColors : Array<string> = []
  @Input('pieChartLabels') public pieChartLabels : Array<string> =[] 
  @Input('pieChartType') public pieChartType: Array<string> =[]
  @Input('chartData') public chartData: Array<any> = []
  // @Input('code') public code : string;
  public isLegentRequired : boolean = false;
  pieChartDataSet : Array<number>;
  public showChart : boolean = false;

  public pieChartOptions: ChartOptions = {
    responsive: false
  }
  
  ngOnInit() {
    let rData = [];
    if(this.pieChartLabels){
      this.pieChartLabels.forEach(fs => {
        let d = this.chartData.find(el => el.fileStatus === fs)
        rData.push(d ? d.count : 0)
      })
      this.pieChartDataSet = rData;
    }
  }

}
