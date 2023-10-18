import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { GlobalConstant } from '@common/constants/global.constant';
import { Audit } from '@common/types';
import { groupBy } from '@common/utils/common.utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-risk-reports-printable-report',
  templateUrl: './risk-reports-printable-report.component.html',
  styleUrls: ['./risk-reports-printable-report.component.scss'],
})
export class RiskReportsPrintableReportComponent implements OnInit {
  private _riskReports!: Audit[];
  @Input() set riskReports(audits: Audit[]) {
    const filtered = audits
      .sort((a, b) => Date.parse(a.reported_at) - Date.parse(b.reported_at))
      .slice(0, GlobalConstant.REPORT_SIZE.RISK_REPORT)
      .reverse();
    this._riskReports = filtered;
    this.summaryRangeMsg = this.getSummaryRange(
      audits.length,
      this.riskReports.length
    );
    this.genDistribution();
  }
  get riskReports() {
    return this._riskReports;
  }
  severityDistribution!: Map<string, number>;
  scanDistribution!: Map<string, number>;
  summaryRangeMsg!: string;

  constructor(private tr: TranslateService, private datePipe: DatePipe) {}

  ngOnInit(): void {}

  textClass(level: string) {
    if (['error', 'critical'].includes(level.toLowerCase())) {
      return 'text-danger';
    }
    return `text-${level.toLowerCase()}`;
  }

  mapEntries(map: Map<string, number>) {
    /*
    console.log("----------------------------------")
    map.forEach((value, key) => {
      console.log(key, value)
    })
    console.log("----------------------------------")
    */
  const severityDistribution = new Map([
      ['Info', 0],
      ['Warning', 0],
      ['Error', 0],
      ['Critical', 0],
    ]);

 
 

  let larr = new Map()
    map.forEach((value, key) => {
      if (key=="Info"){
       larr.set("信息(Info)",value);
      }else if (key=="Warning"){
       larr.set("告警(Warning)",value);
      }else if (key=="Error"){
       larr.set("错误(Error)",value);
      }else if (key=="Critical"){
       larr.set("严重(Critical)",value);
      }else if (key=="Container.Scan.Report"){
       larr.set("容器扫描",value);
      }else if (key=="Host.Scan.Report"){
       larr.set("主机扫描",value);
      }else if (key=="Registry.Scan.Report"){
       larr.set("镜像扫描",value);
      }else if (key=="Platform.Scan.Report"){
       larr.set("平台扫描",value);
      }else if (key=="Compliance.Image.Violation"){
       larr.set("镜像基线违反",value);
      }else if (key=="Compliance.Container.Violation"){
       larr.set("容器基线违反",value);
      }else if (key=="Compliance.ContainerFile.Violation"){
       larr.set("容器文件基线违反",value);
      }else if (key=="Compliance.Host.Violation"){
       larr.set("主机基线违反",value);
      }else{
        larr.set(key,value);
      }
    
    })
  
    return Array.from(larr.entries());
  }

  getSummaryRange(count: number, filteredCount: number) {
    const start = this.riskReports[this.riskReports.length - 1].reported_at;
    const end = this.riskReports[0].reported_at;
    return this.tr.instant('general.PDF_SUMMARY_RANGE_FILTERED', {
      from: this.datePipe.transform(start, 'yyyy-MM-dd HH:mm:ss'),
      to: this.datePipe.transform(end, 'yyyy-MM-dd HH:mm:ss'),
      rangedCount: `${count} ${this.tr.instant('audit.COUNT_POSTFIX')}`,
      filteredCount: filteredCount,
    });
  }
// 对应/v1/log/audit ，需要在服务端进行直接更改返回值列表
  genDistribution() {
    const severityDistribution = new Map([
      ['Info', 0],
      ['Warning', 0],
      ['Error', 0],
      ['Critical', 0],
    ]);
    this.riskReports.forEach(audit => {
      if (!severityDistribution.has(audit.level)) {
        severityDistribution.set(audit.level, 1);
      } else {
        severityDistribution.set(
          audit.level,
          severityDistribution.get(audit.level)! + 1
        );
      }
    });
    this.severityDistribution = new Map(
      [...severityDistribution]
        .filter(a => a[1])
        .sort((a, b) => a[1] - b[1])
        .reverse()
    );
    const scanSummary = groupBy(this.riskReports, 'name');
    const scanDistribution = new Map();
    for (let item in scanSummary) {
      scanDistribution.set(item, scanSummary[item].length);
    }
    this.scanDistribution = new Map(
      [...scanDistribution]
        .filter(a => a[1])
        .sort((a, b) => a[1] - b[1])
        .reverse()
    );
    console.log(this.severityDistribution, this.scanDistribution);
  }
}
