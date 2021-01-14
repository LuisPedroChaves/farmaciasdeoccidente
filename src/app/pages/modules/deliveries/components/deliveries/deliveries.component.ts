import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit {

  smallScreen = window.innerWidth < 960 ? true : false;

  constructor() { }

  ngOnInit(): void {
  }

}
