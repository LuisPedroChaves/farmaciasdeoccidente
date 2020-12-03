import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-role',
  templateUrl: './new-role.component.html',
  styleUrls: ['./new-role.component.scss']
})
export class NewRoleComponent implements OnInit {

  @Input() smallScreen: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
