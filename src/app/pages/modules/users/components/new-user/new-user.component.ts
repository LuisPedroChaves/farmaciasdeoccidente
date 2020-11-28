import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  @Input() deviceXs: boolean;
  constructor() { }

  ngOnInit(): void {
  }

}
