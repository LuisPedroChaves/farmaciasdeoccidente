import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  smallScreen = window.innerWidth < 960 ? true : false;

  sessionsubscription: Subscription;
  productsSubscription: Subscription;


  constructor() { }

  ngOnInit(): void {
  }

}
