import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-risk-report-grid-name-cell',
  templateUrl: './risk-report-grid-name-cell.component.html',
  styleUrls: ['./risk-report-grid-name-cell.component.scss'],
})
export class RiskReportGridNameCellComponent
  implements ICellRendererAngularComp
{
  params!: ICellRendererParams;
  name!: string;
  isParent!: boolean;
  riskMap:Map<string,string> = new Map();
  get isChildVisible() {
    return this.params.data.visible;
  }

  constructor() {
    this.riskMap.set("Host.Privilege.Escalation","主机特权升级");
    this.riskMap.set("Container.Privilege.Escalation","容器特权升级");
    this.riskMap.set("Host.Suspicious.Process","主机可疑进程");
this.riskMap.set("Container.Suspicious.Process","容器可疑进程");
this.riskMap.set("Container.Quarantined","容器隔离");
this.riskMap.set("Container.Unquarantined","容器未隔离");
this.riskMap.set("Host.FileAccess.Violation","主机文件访问");
this.riskMap.set("Container.FileAccess.Violation","容器文件访问");
this.riskMap.set("Host.Package.Updated","主机数据包更新");
this.riskMap.set("Container.Package.Updated","容器数据包更新");
this.riskMap.set("Host.Tunnel.Detected","主机Tunnel检测");
this.riskMap.set("Container.Tunnel.Detected","容器Tunnel检测");
this.riskMap.set("Process.Profile.Violation","进程Profile扫描"); 
this.riskMap.set("Host.Process.Violation","主机进程扫描");    
this.riskMap.set("Compliance.Container.Violation","容器基线扫描");
this.riskMap.set("Compliance.ContainerFile.Violation","容器文件基线扫描");
this.riskMap.set("Compliance.Host.Violation","主机基线扫描");
this.riskMap.set("Compliance.Image.Violation","镜像基线扫描");
this.riskMap.set("Container.Scan.Report","容器扫描");
this.riskMap.set("Host.Scan.Report","主机扫描");
this.riskMap.set("Registry.Scan.Report","镜像库扫描");
this.riskMap.set("Platform.Scan.Report","平台扫描");
this.riskMap.set("Admission.Control.Allowed","准入控制允许");   
this.riskMap.set("Admission.Control.Violation","准入控制违反"); 
this.riskMap.set("Admission.Control.Denied","准入控制拒绝");    
this.riskMap.set("Compliance.ContainerCustomCheck.Violation","容器基线自定义检查");
this.riskMap.set("Compliance.HostCustomCheck.Violation","主机基线自定义检查");
this.riskMap.set("AwsLambda.Scan","Aws扫描");
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.name =String(this.riskMap.get(params.data.name));
   // this.name = params.data.name;
    this.isParent = !params.data.parent_id && params.data.child_id;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  toggleVisible(): void {
    this.params.data.visible = !this.params.data.visible;
    const child_node = this.params.api.getRowNode(this.params.data.child_id);
    if (child_node) child_node.data.visible = !child_node.data.visible;
    this.params.api.onFilterChanged();
  }
}
