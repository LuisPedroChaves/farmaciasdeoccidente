import { Component, OnInit, Input } from '@angular/core';

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

  // tslint:disable-next-line: typedef
  saveRole() {
    const permissions = this.allPermissions.filter(p => p.selected === true);
    const company = this.companies.findIndex(c => c.name === this.currentPermissions);
    if (company > -1) {
      this.newRole._company = this.companies[company];
    }
  }

}
