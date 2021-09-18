import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-prices',
  templateUrl: './update-prices.component.html',
  styleUrls: ['./update-prices.component.scss']
})
export class UpdatePricesComponent implements OnInit {

  smallScreen = window.innerWidth < 960 ? true : false;

  newPurchase = {
    products: [
      {
        quantity: 10,
        _product: {
          name: 'PRODUCTO 1'
        },
        price: 100,
        bono: 2,
        discount: 0,
        cost: 83.33,
        realQuantity: 10,
        expirationDate: '05/11/2021'
      },
      {
        quantity: 50,
        _product: {
          name: 'PRODUCTO CON NOMBRE LARGO'
        },
        price: 47.26,
        bono: 0,
        discount: 0,
        cost: 47.26,
        realQuantity: 45,
        expirationDate: '05/11/2021'
      },
      {
        quantity: 500,
        _product: {
          name: 'PRODUCTO CON NOMBRE LARGO ESTE ES UN PRODUCTO DE PRUEBA'
        },
        price: 10,
        bono: 0,
        discount: 10,
        cost: 9,
        realQuantity: 500,
        expirationDate: '05/11/2021'
      },
    ]
  }

  constructor() { }

  ngOnInit(): void {
  }

}
