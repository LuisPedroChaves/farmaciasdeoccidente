import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  smallScreen = window.innerWidth < 960 ? true : false;

  constructor() { }

  ngOnInit(): void {
  }

}
