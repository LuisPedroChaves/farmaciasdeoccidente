import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  smallScreen = window.innerWidth < 960 ? true : false;

  constructor(
  ) { }

  ngOnInit(): void {
  }
}
