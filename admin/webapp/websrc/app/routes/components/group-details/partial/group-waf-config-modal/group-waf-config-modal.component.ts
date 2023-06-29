import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { GroupsService } from '@services/groups.service';
import { WafSensor } from '@common/types';
import { NotificationService } from '@services/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-group-waf-config-modal',
  templateUrl: './group-waf-config-modal.component.html',
  styleUrls: ['./group-waf-config-modal.component.scss']
})
export class GroupWafConfigModalComponent implements OnInit {

  gridOptions4WafSensorOption: GridOptions;
  filteredCount: number = 0;
  filtered: boolean = false;
  wafSensorOption: Array<WafSensor> = [];
  selectedWafSensors: Array<WafSensor> = [];
  selectedWafSensorNodes: Array<any> = [];
  submittingUpdate: boolean = false;
  context = {componentParent: this};


  constructor(
    public dialogRef: MatDialogRef<GroupWafConfigModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private groupsService: GroupsService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.gridOptions4WafSensorOption = this.groupsService.prepareGrid4WafSensorOption();
    this.gridOptions4WafSensorOption.onSelectionChanged = () => {
      this.selectedWafSensors = this.gridOptions4WafSensorOption.api!.getSelectedRows();
      this.selectedWafSensorNodes = this.gridOptions4WafSensorOption.api!.getSelectedNodes();
    };
    this.refresh();
  }

  onCancel = () => {
    this.dialogRef.close(false);
  };

  refresh = () => {
    this.groupsService.getWafSensorData()
      .subscribe(
        (response: any) => {
          this.wafSensorOption = response;
          this.wafSensorOption = this.wafSensorOption.map(sensor => {
            return Object.assign(sensor, { isAllowed: false });
          });
          this.gridOptions4WafSensorOption.api!.setRowData(this.wafSensorOption);
          setTimeout(() => {
            this.gridOptions4WafSensorOption.api!.forEachNode((node, index) => {
              this.data.configuredSensors.forEach(configuredSensor => {
                if (node.data.name === configuredSensor.name) {
                  node.data.isAllowed = configuredSensor.action === "allow";
                  node.setSelected(true);
                }
              });
            });
          }, 200);
          this.filteredCount = this.wafSensorOption.length;
        },
        error => {}
      );
  };

  adoptSensors = () => {
    this.submittingUpdate = true;
    let payload = {
      config: {
        name: this.data.groupName,
        status:  this.data.status,
        replace: this.selectedWafSensors.map(sensor => {
          return {
            name: sensor.name,
            action: sensor.isAllowed ? "allow" : "deny"
          };
        })
      }
    };

    this.groupsService.updateGroupWafSensorData(payload)
      .subscribe(
        response => {
          this.notificationService.open(this.translate.instant("group.waf.msg.SETTING_OK"));
          setTimeout(() => {
            this.data.refresh();
          }, 1000);
          this.dialogRef.close(true);
        },
        error => {
          this.notificationService.openError(error.error, this.translate.instant("group.waf.msg.SETTING_NG"));
        }
      );
  };

  filterCountChanged = (results: number) => {
    this.filteredCount = results;
    this.filtered =
      this.filteredCount !== this.wafSensorOption.length;
  }
}
