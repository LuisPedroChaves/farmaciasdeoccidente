import { Component, OnInit, Input } from '@angular/core';
import { EventBusService } from '../../../../../core/services/internal/event-bus.service';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { ControlEvent } from '../../../../../core/models/ControlEvent';


@Component({
  selector: 'app-new-role',
  templateUrl: './new-role.component.html',
  styleUrls: ['./new-role.component.scss']
})
export class NewRoleComponent implements OnInit {
  // screen ------
  @Input() smallScreen: boolean;
  @Input() companies: any[];
  allExpandState = true;

  // permissions
  allPermissions: any[];
  currentPermissions = 'cpo';
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
