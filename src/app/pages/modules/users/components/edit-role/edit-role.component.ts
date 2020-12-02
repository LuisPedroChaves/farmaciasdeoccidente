import { Component, OnInit, Input } from '@angular/core';


import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit {

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


  // tslint:disable-next-line: max-line-length
  constructor( ) { }

  ngOnInit(): void {
    this.newRole = {...this.currentRole, permissions: []};

  }


  // tslint:disable-next-line: typedef
  parsePermission() {
    this.allPermissions.forEach(p => {
      const index = this.currentRole.permissions.findIndex(cp => cp.name === p.name);
      if (index > -1) {
        p.selected = true;
        p.options = this.currentRole.permissions[index].options;
      }
    });
  }


  getPermissions(parent: string): any[] {
    return this.allPermissions.filter(p => p.parent === parent);
  }

  // tslint:disable-next-line: typedef
  saveRole() {
    const permissions = this.allPermissions.filter(p => p.selected === true);

    this.newRole.permissions = permissions;
  
  }


  // tslint:disable-next-line: typedef
  getCompany(name: string) {
    switch (name) {
      case 'cpo': return 'CPO';
      case 'icb': return 'ICB';
      case 'seo': return 'SEO';
      default: return 'ADMIN';
    }
  }

  // tslint:disable-next-line: typedef
  delete() {

  }
}
