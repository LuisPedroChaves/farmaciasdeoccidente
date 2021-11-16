import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inventoried-products',
  templateUrl: './inventoried-products.component.html',
  styleUrls: ['./inventoried-products.component.scss'],
})
export class InventoriedProductsComponent implements OnInit {
  smallScreen = window.innerWidth < 960 ? true : false;

  constructor() {}

  ngOnInit(): void {}

  finishInventory(): void {}
}
