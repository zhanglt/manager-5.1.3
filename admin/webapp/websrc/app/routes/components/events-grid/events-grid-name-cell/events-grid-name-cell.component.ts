import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-events-grid-name-cell',
  templateUrl: './events-grid-name-cell.component.html',
  styleUrls: ['./events-grid-name-cell.component.scss'],
})
export class EventsGridNameCellComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  name!: string;
  isParent!: boolean;
  eventMap:Map<string,string> = new Map();
  get isChildVisible() {
    return this.params.data.visible;
  }

  constructor() {
this.eventMap.set("Container.Start","容器启动");
this.eventMap.set("Container.Stop","容器停止");
this.eventMap.set("Container.Remove","容器删除");
this.eventMap.set("Container.Secured","容器防护");
this.eventMap.set("Container.Unsecured","容器未防护");
this.eventMap.set("Enforcer.Start","执行器启动");
this.eventMap.set("Enforcer.Join","执行器加入");
this.eventMap.set("Enforcer.Stop","执行器停止");
this.eventMap.set("Enforcer.Disconnect","执行器断开");
this.eventMap.set("Enforcer.Connect","执行器连接");
this.eventMap.set("Enforcer.Kicked","执行器异常");
this.eventMap.set("Controller.Start","控制器启动");
this.eventMap.set("Controller.Join","控制器加入");
this.eventMap.set("Controller.Leave","控制器脱机");
this.eventMap.set("Controller.Stop","控制器停止");
this.eventMap.set("Controller.Disconnect","执行断开");
this.eventMap.set("Controller.Connect","控制器连接");
this.eventMap.set("Controller.Lead.Lost","控制器lead丢失");
this.eventMap.set("Controller.Lead.Elected","控制器lead选举");
this.eventMap.set("User.Login","用户登录");
this.eventMap.set("User.Logout","用户注销");
this.eventMap.set("User.Timeout","用户超时");
this.eventMap.set("User.Login.Failed","用户登录失败");
this.eventMap.set("User.Login.Blocked","用户登陆锁定");
this.eventMap.set("User.Login.Unblocked","用户登陆解锁");
this.eventMap.set("User.Password.Reset","用户重置密码");
this.eventMap.set("User.Resource.Access.Denied","用户资源访问受限");
this.eventMap.set("RESTful.Write","api写入");
this.eventMap.set("RESTful.Read","api读取");
this.eventMap.set("Scanner.Join","扫描器加入");
this.eventMap.set("Scanner.Update","扫描器更新");
this.eventMap.set("Scanner.Leave","扫描器脱机");
this.eventMap.set("Scan.Failed","扫描失败");
this.eventMap.set("Scan.Succeeded","aaaaa");
this.eventMap.set("Docker.CIS.Benchmark.Failed","Docker基线测试失败");
this.eventMap.set("Kubenetes.CIS.Benchmark.Failed","k8s基线测试失败");
this.eventMap.set("License.Update","Lic更新");
this.eventMap.set("License.Expire","lic超时");
this.eventMap.set("License.Remove","lic删除");
this.eventMap.set("License.EnforcerLimitReached","aaaaa");
this.eventMap.set("Admission.Control.Configured","准入控制配置");
this.eventMap.set("Admission.Control.ConfigFailed","准入控制配置失败");
this.eventMap.set("ConfigMap.Load","ConfigMap载入");
this.eventMap.set("ConfigMap.Failed","ConfigMap错误");
this.eventMap.set("Crd.Import","Crd导入");
this.eventMap.set("Crd.Remove","Crd删除");
this.eventMap.set("Crd.Error","Crd错误");
this.eventMap.set("Federation.Promote","联邦升级");
this.eventMap.set("Federation.Demote","联邦降级");
this.eventMap.set("Federation.Join","联邦加入");
this.eventMap.set("Federation.Leave","联邦脱机");
this.eventMap.set("Federation.Kick","联邦异常");
this.eventMap.set("Federation.Policy.Sync","联邦策略同步");
this.eventMap.set("Configuration.Import","配置导入");
this.eventMap.set("Configuration.Export","配置导出");
this.eventMap.set("Configuration.Import.Failed","配置导入错误");
this.eventMap.set("Configuration.Export.Failed","配置导出错误");
this.eventMap.set("Cloud.Scan.Normal","云扫描正常");
this.eventMap.set("Cloud.Scan.Alert","云扫描告警");
this.eventMap.set("Cloud.Scan.Fail","云扫描失败");
this.eventMap.set("Group.Auto.Remove","组自动删除");
this.eventMap.set("Agent.Memory.Pressure","代理内存预警");
this.eventMap.set("Controller.Memory.Pressure","控制器内存预警");
this.eventMap.set("Kubenetes.NeuVector.RBAC","k8s RBAC");
this.eventMap.set("Group.Auto.Promote","组自动升级");
this.eventMap.set("User.Password.Alert","用户密码告警");

  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.name =String(this.eventMap.get(params.data.name));//params.data.name;
    //this.name =params.data.name
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
