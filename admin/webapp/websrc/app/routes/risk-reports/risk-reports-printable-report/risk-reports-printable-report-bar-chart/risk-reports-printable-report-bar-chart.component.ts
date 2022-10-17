import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-risk-reports-printable-report-bar-chart',
  templateUrl: './risk-reports-printable-report-bar-chart.component.html',
  styleUrls: ['./risk-reports-printable-report-bar-chart.component.scss'],
})
export class RiskReportsPrintableReportBarChartComponent implements OnInit {
  @Input() statisticData!: Map<string, number>;
  barChartData!: ChartConfiguration<'bar', number[], string[]>;

  constructor(private tr: TranslateService) {}

  ngOnInit(): void {
    const TYPE_BAR_COLOR = '#ff9800';
    const TYPE_BAR_LABELS = [...this.statisticData.keys()] as any[];
    this.barChartData = {
      options: {
        indexAxis: 'y',
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: this.tr.instant('audit.report.chartTitleByScanType'),
          },
          legend: {
            display: false,
          },
        },
      },
      data: {
        labels: TYPE_BAR_LABELS,
        datasets: [
          {
            hoverBorderColor: TYPE_BAR_COLOR,
            hoverBackgroundColor: TYPE_BAR_COLOR,
            backgroundColor: TYPE_BAR_COLOR,
            data: Array.from(this.statisticData.values()),
          },
        ],
      },
      type: 'bar',
    };
  }
}
