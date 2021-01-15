import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventBusService } from '../../../../../core/services/internal/event-bus.service';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { ControlEvent } from '../../../../../core/models/ControlEvent';
import { PermissionItem, RoleItem } from 'src/app/core/models/Role';
import { RoleService } from '../../../../../core/services/httpServices/role.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})
export class RoleEditComponent implements OnInit {

  // screen ------
  @Input() smallScreen: boolean;
  allExpandState = true;
  creatingRol = false;

  // permissions
  allPermissions: PermissionItem[];
  @Input() currentPermissions: string;
  @Input() currentRole: RoleItem;
  currentForm: any[];

  newRole: RoleItem = {
    name: null,
    type: null,
    permissions: []
  };

  constructor(
    public eventBus: EventBusService,
    public config: ConfigService,
    public roleService: RoleService,
    public toasty: ToastyService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.newRole = { ...this.currentRole, permissions: [] };
    this.roleService.getPermissionsList().subscribe(data => {
      this.allPermissions = data;
      const type = this.allPermissions.filter(p => p.parent === this.currentPermissions);
      this.currentForm = type;
      this.parsePermission();
    });
  }

  parsePermission() {
    this.allPermissions.forEach(p => {
      const index = this.currentRole.permissions.findIndex(cp => cp.name === p.name);
      if (index > -1) {
        p.selected = true;
        p.options = this.currentRole.permissions[index].options;
      }
    });
  }

  emitEvent(event: string, payload?: any) {
    const e: ControlEvent = new ControlEvent();
    e.Event = event;
    e.Payload = payload;
    this.eventBus.setData(e);
  }

  getPermissions(parent: string): any[] {
    return this.allPermissions.filter(p => p.parent === parent);
  }

  saveRole() {
    this.creatingRol = true;
    const permissions = this.allPermissions.filter(p => p.selected === true);

    this.newRole.permissions = permissions;
    this.roleService.updateRole(this.newRole).subscribe(data => {
      this.toasty.success('Rol creado exitósamente');
      this.newRole = undefined;
      this.emitEvent(this.config.EVENT_USERS_CHANGE_COMPONENT, 'rolelist');
      this.creatingRol = false;
    }, error => {
      this.creatingRol = false;
      this.toasty.error('Error de Rol', 'Hubo un problema al crear el rol. Intente de nuevo más tarde');
    });
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: this.smallScreen ? '100%' : '350px',
      data: { title: 'Eliminar Rol', message: '¿Confirma que desea eliminar el rol ' + this.newRole.name + '?'},
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === true) {
          this.creatingRol = true;
          this.roleService.deleteRole(this.newRole).subscribe(data => {
            this.toasty.success('Rol Eliminado exitosamente');
            this.emitEvent(this.config.EVENT_USERS_CHANGE_COMPONENT, 'rolelist');
          }, error => {
            this.toasty.error('Error', 'Hubo un problema al eliminar el rol, intente de nuevo más tarde.');
          });
        }
      }
    });
  }
}
