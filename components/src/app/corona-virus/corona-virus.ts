import { BaseComponents } from '../base-components';
import { AppToastService } from '../services/notification-service';
import { ViewEncapsulation, Input, ViewChild, Component, OnInit, ElementRef, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';

@Component({
  selector: 'corona-virus',
  templateUrl: './corona-virus.html',
  styleUrls: [
    './corona-virus.css'
  ],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class CoronaVirusComponent extends BaseComponents implements OnInit {

  @Input()
  public data:Array<any>;
  @ViewChild("modal") modal: ElementRef;
  @ViewChild("canvas") canvas: ElementRef;
  lineChart: any;


  constructor(private zone:NgZone, public toastService:AppToastService, public http:HttpClient){
    super();
  }

  buildChart(labels,cases, colors){
    const ctx = this.canvas.nativeElement.getContext('2d');
    this.lineChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            data: cases,
            borderColor: '#3cb371',
            backgroundColor: colors,
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: false
          }],
          yAxes: [{
            display: false
          }],
        }
      }
    });
  }

  async ngOnInit(): Promise<void> {
    const apiUrl = "https://coronavirus-tracker-api.herokuapp.com/v2/locations";
    const data:any = await this.http.get(apiUrl).toPromise();
    const dynamicColors = () => {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      return "rgb(" + r + "," + g + "," + b + ")";
   };


    const labels = data.locations.map(country => {
      return `${country.country} / ${country.province}`;
    });
    const confirmedCases = data.locations.map(country => {
      return country.latest.confirmed;
    });
    const colors = data.locations.map(country => {
      return dynamicColors();
    });


    await this.zone.run(async () => {
      this.buildChart(labels,confirmedCases,colors);
    });


  }

  async ngOnChanges(changes){
    console.log(changes);
  }


}
