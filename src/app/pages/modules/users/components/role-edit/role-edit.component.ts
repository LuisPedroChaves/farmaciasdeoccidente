import { Component, OnInit, Input } from '@angular/core';
import { EventBusService } from '../../../../../core/services/internal/event-bus.service';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { ControlEvent } from '../../../../../core/models/ControlEvent';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})
export class RoleEditComponent implements OnInit {

   // screen ------
  @Input() smallScreen: boolean;
  allExpandState = true;

  // permissions
  allPermissions: any[];
  @Input() currentPermissions: string;
  @Input() currentRole: any;
  currentForm: any[];

  newRole: any = {
    name: null,
    _company: null,
    permissions: []
  };


  constructor() { }

  ngOnInit(): void {

  }

  getPermissions(parent: string): any[] {
    return this.allPermissions.filter(p => p.parent === parent);
  }
  }

