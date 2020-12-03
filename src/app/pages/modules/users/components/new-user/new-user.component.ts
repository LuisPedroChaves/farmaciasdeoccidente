import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  @Input() smallScreen: boolean;
  @Input() roles: any;

  constructor() { }

  ngOnInit(): void {
  }

}
