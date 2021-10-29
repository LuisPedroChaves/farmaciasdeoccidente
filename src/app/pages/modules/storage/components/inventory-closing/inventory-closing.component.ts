import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inventory-closing',
  templateUrl: './inventory-closing.component.html',
  styleUrls: ['./inventory-closing.component.scss'],
})
export class InventoryClosingComponent implements OnInit {
  smallScreen = window.innerWidth < 960 ? true : false;

  inventoryPending = true;
  constructor() {}

  ngOnInit(): void {}
}
