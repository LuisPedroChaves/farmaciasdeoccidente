import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  smallScreen = window.innerWidth < 960 ? true : false;
  purchasesp: string[] = ["read", "update", "delete", "create"];


  requisition: number = 0;
  created: number = 0;
  updated: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  totalRequisition(event: number) {
    this.requisition = event;
  }

  totalCreated(event: number) {
    this.created = event;
  }

  totalUpdated(event: number) {
    this.updated = event;
  }

}
