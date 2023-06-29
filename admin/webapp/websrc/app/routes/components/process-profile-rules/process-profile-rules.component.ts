import {
  Component,
  Input,
  Output,
  OnChanges,
  OnInit,
  SimpleChanges,
  EventEmitter
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GlobalConstant } from '@common/constants/global.constant';
import { GridOptions } from 'ag-grid-community';
import { UtilsService } from '@common/utils/app.utils';
import { ProcessProfileRulesService } from '@services/process-profile-rules.service';
import { AddEditProcessProfileRuleModalComponent } from './partial/add-edit-process-profile-rule-modal/add-edit-process-profile-rule-modal.component';
import { GlobalVariable } from '@common/variables/global.variable';
import { AuthUtilsService } from '@common/utils/auth.utils';
import { ConfirmDialogComponent } from '@components/ui/confirm-dialog/confirm-dialog.component';
import { switchMap } from 'rxjs/operators';
import { NotificationService } from '@services/notification.service';
import { QuickFilterService } from '@components/quick-filter/quick-filter.service';
import { updateGridData } from '@common/utils/common.utils';

@Component({
  selector: 'app-process-profile-rules',
  templateUrl: './process-profile-rules.component.html',
  styleUrls: ['./process-profile-rules.component.scss'],
})
export class ProcessProfileRulesComponent implements OnInit, OnChanges {
  @Input() isScoreImprovement: boolean = false;
  @Input() source!: string;
  @Input() groupName: string = '';
  @Input() resizableHeight!: number;
  @Input() cfgType: string = '';
  @Input() baselineProfile: string = '';
  @Input() useQuickFilterService: boolean = false;
  @Output() getSelectedProcessProfileRules = new EventEmitter();
  @Output() getRemoveProfile = new EventEmitter();
  @Output() getEditProfile = new EventEmitter();
  @Output() getAddProfile = new EventEmitter();
  public groups: Set<string> = new Set();
  public gridHeight: number = 0;
  public gridOptions!: GridOptions;
  public processProfileRules: Array<any> = [];
  public selectedProcessProfileRules;
  public navSource = GlobalConstant.NAV_SOURCE;
  public groupNames!: string[];
  public groupSelection = new FormControl('All', [Validators.required]);
  public filteredCount: number = 0;
  public globalConstant4Html = GlobalConstant;
  private isModalOpen: boolean = false;
  private processProfileRuleErr: boolean = false;
  public isWriteGroupAuthorized: boolean = false;
  public isWriteProcessProfileRuleAuthorized: boolean = false;
  context = { componentParent: this };
  private w: any;

  constructor(
    private processProfileRulesService: ProcessProfileRulesService,
    private authUtilsService: AuthUtilsService,
    private translate: TranslateService,
    private utils: UtilsService,
    private dialog: MatDialog,
    private quickFilterService: QuickFilterService,
    private notificationService: NotificationService
  ) {
    this.w = GlobalVariable.window;
  }

  ngOnInit(): void {
    console.log('on process profile rules init: ', this.source, this.baselineProfile);
    this.source = this.source ? this.source : GlobalConstant.NAV_SOURCE.SELF;
    this.isWriteGroupAuthorized =
      this.authUtilsService.getDisplayFlag('write_group') &&
      (this.source !== GlobalConstant.NAV_SOURCE.GROUP
        ? this.authUtilsService.getDisplayFlag('multi_cluster')
        : true);
    this.isWriteProcessProfileRuleAuthorized =
      (this.source === GlobalConstant.NAV_SOURCE.GROUP &&
        (this.cfgType === GlobalConstant.CFG_TYPE.CUSTOMER ||
          this.cfgType === GlobalConstant.CFG_TYPE.LEARNED)) ||
      (this.source === GlobalConstant.NAV_SOURCE.FED_POLICY &&
        this.cfgType === GlobalConstant.CFG_TYPE.FED);
    this.gridOptions = this.processProfileRulesService.prepareGrid(
      this.isWriteGroupAuthorized,
      this.isWriteProcessProfileRuleAuthorized,
      this.source,
      this.isScoreImprovement,
    );
    this.gridOptions.onSelectionChanged = () => {
      this.onSelectionChanged4Profile();
    };
    this.getProcessProfileRules(this.groupName);
    this.groups.add('All');
    if (this.useQuickFilterService) {
      this.quickFilterService.textInput$.subscribe((value: string) => {
        this.quickFilterService.onFilterChange(value, this.gridOptions);
      });
    }
    this.emitObjects();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (
      changes.groupName &&
      changes.groupName.previousValue &&
      changes.groupName.previousValue !== changes.groupName.currentValue
    ) {
      this.getProcessProfileRules(this.groupName);
    }
    this.emitObjects();
  }

  getProcessProfileRules = groupName => {
    this.selectedProcessProfileRules = null;
    if (this.gridOptions) {
      this.gridOptions.overlayNoRowsTemplate = `<span class="overlay">${this.translate.instant(
        'general.NO_ROWS'
      )}</span>`;
    }
    if (groupName !== GlobalConstant.EXTERNAL) {
      this.processProfileRulesService
        .getProcessProfileRulesData(groupName)
        .subscribe(
          response => {
            let processProfileData: Array<any> = [];
            if (groupName === '') {
              processProfileData = response['process_profiles'];
              let profiles = processProfileData.flatMap(profile => {
                if (profile.process_list.length > 0) {
                  this.groups.add(profile.group);
                }
                return profile.process_list.map(process => {
                  return Object.assign(process, { group: profile.group });
                });
              });
              this.processProfileRules = profiles.filter(profile => {
                if (groupName === '') return true;
                return groupName === profile.group;
              });
            } else {
              this.processProfileRules =
                response['process_profile']['process_list'];
            }
            this.filteredCount = this.processProfileRules.length;

            this.gridHeight =
              this.source === GlobalConstant.NAV_SOURCE.GROUP
                ? this.w.innerHeight - 572
                : this.source === GlobalConstant.NAV_SOURCE.FED_POLICY
                ? this.w.innerHeight - 300
                : 0;
            setTimeout(() => {
              if (this.gridOptions.api) {
                this.gridOptions.api.sizeColumnsToFit();
              }
              this.getSelectedProcessProfileRules.emit(this.selectedProcessProfileRules);
            });
          },
          err => {
            console.warn(err);
            if (err.status !== GlobalConstant.STATUS_NOT_FOUND) {
              this.gridOptions.overlayNoRowsTemplate =
                this.utils.getOverlayTemplateMsg(err);
            }
            this.processProfileRules = [];
          }
        );
    }
  };

  onSelectionChanged4Profile = () => {
    if (this.gridOptions && this.gridOptions.api) {
      let selectedRows = this.gridOptions.api.getSelectedRows();
      setTimeout(() => {
        this.selectedProcessProfileRules = selectedRows;
        this.getSelectedProcessProfileRules.emit(this.selectedProcessProfileRules);
      });
    }
  };

  editProfile = data => {
    console.log(data)
    this.isModalOpen = true;
    let editDialogRef = this.dialog.open(
      AddEditProcessProfileRuleModalComponent,
      {
        data: {
          type: 'edit',
          groupName: this.groupName,
          oldData: data,
          source: this.source,
          getProcessProfileRules: this.getProcessProfileRules,
          gridApi: this.gridOptions.api!,
          processProfileRules: this.processProfileRules
        },
        width: "70%"
      }
    );
    editDialogRef.afterClosed().subscribe(() => {
      this.isModalOpen = false;
      this.selectedProcessProfileRules = null;
      this.getSelectedProcessProfileRules.emit(this.selectedProcessProfileRules);
    });
  };

  removeProfile = data => {
    let message = `${this.translate.instant(
      'service.PROFILE_DELETE_CONFIRMATION'
    )} - ${data.map(item => item.name).join(',')}`;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '700px',
      data: {
        message: message,
      },
    });
    dialogRef.componentInstance.confirm
      .pipe(
        switchMap(() => {
          return this.processProfileRulesService.updateProcessProfileRules(
            GlobalConstant.CRUD.D,
            this.source === GlobalConstant.NAV_SOURCE.FED_POLICY
              ? data[0].group
              : this.groupName,
            {},
            data,
            this.source === GlobalConstant.NAV_SOURCE.FED_POLICY
              ? GlobalConstant.SCOPE.FED
              : GlobalConstant.SCOPE.LOCAL
          );
        })
      )
      .subscribe(
        res => {
          // confirm actions
          this.notificationService.open(
            this.translate.instant('group.profile.REMOVE_OK')
          );
          updateGridData(
            this.processProfileRules,
            data,
            this.gridOptions.api!,
            ['name', 'path'],
            'delete'
          );
          this.selectedProcessProfileRules = null;
          this.getSelectedProcessProfileRules.emit(this.selectedProcessProfileRules);
          // close dialog
          dialogRef.componentInstance.onCancel();
          dialogRef.componentInstance.loading = false;
        },
        error => {
          this.notificationService.openError(
            error.error,
            this.translate.instant('group.profile.REMOVE_NG')
          );
          dialogRef.componentInstance.loading = false;
        }
      );
  };

  addProfile = () => {
    this.isModalOpen = true;
    let addDialogRef = this.dialog.open(
      AddEditProcessProfileRuleModalComponent,
      {
        data: {
          type: 'add',
          groupName: this.groupName,
          source: this.source,
          getProcessProfileRules: this.getProcessProfileRules,
          gridApi: this.gridOptions.api!,
          processProfileRules: this.processProfileRules
        },
        width: "70%"
      }
    );
    addDialogRef.afterClosed().subscribe(result => {
      this.isModalOpen = false;
      this.selectedProcessProfileRules = null;
      this.getSelectedProcessProfileRules.emit(this.selectedProcessProfileRules);
    });
  };

  onGroupChanged = (groupName: string, gridOptions: GridOptions) => {
    if (gridOptions && gridOptions.api) {
      const filterInstance = gridOptions.api.getFilterInstance('group');
      if (filterInstance) {
        const model = filterInstance.getModel();
        filterInstance.setModel({
          type: 'equals',
          filter: groupName === 'All' ? '' : groupName,
        });
        gridOptions.api.onFilterChanged();
        this.filteredCount =
          gridOptions.api.getModel()['rootNode'].childrenAfterFilter.length;
      }
    }
  };

  private emitObjects = () => {
    this.getRemoveProfile.emit(this.removeProfile);
    this.getEditProfile.emit(this.editProfile);
    this.getAddProfile.emit(this.addProfile);
  };
}
