import { Component, OnInit, Input } from '@angular/core';
import { PermissionItem, RoleItem } from 'src/app/core/models/Role';
import { EventBusService } from '../../../../../core/services/internal/event-bus.service';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { RoleService } from '../../../../../core/services/httpServices/role.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { ControlEvent } from 'src/app/core/models/ControlEvent';

@Component({
  selector: 'app-new-role',
  templateUrl: './new-role.component.html',
  styleUrls: ['./new-role.component.scss']
})
export class NewRoleComponent implements OnInit {
  // screen ------
  @Input() smallScreen: boolean;
  allExpandState = true;
  creatingRol = false;

  // permissions
  allPermissions: PermissionItem[];
  currentPermissions = 'PHARMA';
  currentForm: any[];

  newRole: RoleItem = {
    name: '',
    type: 'PHARMA',
    permissions: []
  };

  constructor(
    public eventBus: EventBusService,
    public config: ConfigService,
    public roleService: RoleService,
    public toasty: ToastyService
  ) { }

  ngOnInit(): void {
    this.roleService.getPermissionsList().subscribe(data => {
      this.allPermissions = data;
      const company = this.allPermissions.filter(p => p.parent === this.currentPermissions);
      this.currentForm = company;
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

    this.newRole.type = this.currentPermissions;
    this.newRole.permissions = permissions;
    this.roleService.createRole(this.newRole).subscribe(data => {
      this.toasty.success('Rol creado exitósamente');
      this.newRole = undefined;
      this.emitEvent(this.config.EVENT_USERS_CHANGE_COMPONENT, 'rolelist');
      this.creatingRol = false;
    }, error => {
      this.creatingRol = false;
      this.toasty.error('Error de Rol', 'Hubo un problema al crear el rol. Intente de nuevo más tarde');
    });
  }

}
