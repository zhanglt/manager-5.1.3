import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-compliance-items-charts',
  templateUrl: './compliance-items-charts.component.html',
  styleUrls: ['./compliance-items-charts.component.scss'],
})
export class ComplianceItemsChartsComponent implements OnInit, OnChanges {
  @Input() complianceDist!: any;
  complianceSeverityDistChartData!: ChartConfiguration<
    'doughnut',
    number[],
    string[]
  >;
  complianceTargetDistChartData!: ChartConfiguration<
    'doughnut',
    number[],
    string[]
  >;

  constructor(private translateService: TranslateService) {}

  updateData(): void {
    this.complianceTargetDistChartData.data = {
      ...this.complianceTargetDistChartData.data,
      datasets: [
        {
          ...this.complianceTargetDistChartData.data.datasets[0],
          data: [
            this.complianceDist.error,
            this.complianceDist.high,
            this.complianceDist.warning,
            this.complianceDist.note,
            this.complianceDist.info,
            this.complianceDist.pass,
          ],
        },
      ],
    };
    this.complianceSeverityDistChartData.data = {
      ...this.complianceSeverityDistChartData.data,
      datasets: [
        {
          ...this.complianceSeverityDistChartData.data.datasets[0],
          data: [
            this.complianceDist.platform,
            this.complianceDist.image,
            this.complianceDist.node,
            this.complianceDist.container,
          ],
        },
      ],
    };
  }

  ngOnInit(): void {
    this.complianceTargetDistChartData = {
      options: {
        cutout: 60,
        elements: {
          arc: {
            borderWidth: 0,
          },
        },
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            mode: 'point',
          },
          title: {
            display: true,
            text: this.translateService.instant(
              'cis.report.others.SEVERITY_DIS'
            ),
          },
          legend: {
            display: true,
            labels: {
              boxWidth: 12,
            },
          },
        },
      },
      data: {
        labels: [
          ['错误'],
          ['高级别'],
          ['警告'],
          ['提示'],
          ['信息'],
          ['通过'],
        ],
        datasets: [
          {
            hoverBackgroundColor: [
              '#f22d3a',
              '#ef5350',
              '#ff9800',
              '#ffb661',
              '#36A2EB',
              '#6A8E6D',
            ],
            backgroundColor: [
              '#f22d3a',
              '#ef5350',
              '#ff9800',
              '#ffb661',
              '#36A2EB',
              '#6A8E6D',
            ],
            data: [
              this.complianceDist.error,
              this.complianceDist.high,
              this.complianceDist.warning,
              this.complianceDist.note,
              this.complianceDist.info,
              this.complianceDist.pass,
            ],
          },
        ],
      },
      type: 'doughnut',
    };

    this.complianceSeverityDistChartData = {
      options: {
        cutout: 60,
        elements: {
          arc: {
            borderWidth: 0,
          },
        },
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            mode: 'point',
          },
          title: {
            display: true,
            text: this.translateService.instant('cis.report.others.TARGET_DIS'),
          },
          legend: {
            display: true,
            labels: {
              boxWidth: 12,
            },
          },
        },
      },
      data: {
        labels: [['平台'], ['镜像'], ['主机'], ['容器']],
        datasets: [
          {
            hoverBackgroundColor: ['#f22d3a', '#86aec2', '#4D5360', '#36A2EB'],
            backgroundColor: ['#f22d3a', '#86aec2', '#4D5360', '#36A2EB'],
            data: [
              this.complianceDist.platform,
              this.complianceDist.image,
              this.complianceDist.node,
              this.complianceDist.container,
            ],
          },
        ],
      },
      type: 'doughnut',
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.complianceDist && !changes.complianceDist.isFirstChange()) {
      this.updateData();
    }
  }
}
