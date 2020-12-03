import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})
export class RoleEditComponent implements OnInit {
  @Input() smallScreen: boolean;
  @Input() currentRole: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
