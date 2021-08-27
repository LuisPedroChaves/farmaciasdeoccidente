import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-details-purchase',
  templateUrl: './details-purchase.component.html',
  styleUrls: ['./details-purchase.component.scss']
})
export class DetailsPurchaseComponent implements OnInit {

  newPurchase = {
    products: [
      {
        quantity: 10,
        _product: {
          name: 'PRODUCTO 1'
        },
        price: 100.00,
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
        price: 10.00,
        bono: 0,
        discount: 10,
        cost: 9,
        realQuantity: 500,
        expirationDate: '05/11/2021'
      },
      {
        quantity: 500,
        _product: {
          name: 'PRODUCTO CON NOMBRE LARGO ESTE ES UN PRODUCTO DE PRUEBA'
        },
        price: 10.00,
        bono: 0,
        discount: 10,
        cost: 9,
        realQuantity: 500,
        expirationDate: '05/11/2021'
      },
      {
        quantity: 500,
        _product: {
          name: 'PRODUCTO CON NOMBRE LARGO ESTE ES UN PRODUCTO DE PRUEBA'
        },
        price: 10.00,
        bono: 0,
        discount: 10,
        cost: 9,
        realQuantity: 500,
        expirationDate: '05/11/2021'
      },
      {
        quantity: 500,
        _product: {
          name: 'PRODUCTO CON NOMBRE LARGO ESTE ES UN PRODUCTO DE PRUEBA'
        },
        price: 10.00,
        bono: 0,
        discount: 10,
        cost: 9,
        realQuantity: 500,
        expirationDate: '05/11/2021'
      },
      {
        quantity: 500,
        _product: {
          name: 'PRODUCTO CON NOMBRE LARGO ESTE ES UN PRODUCTO DE PRUEBA'
        },
        price: 10.00,
        bono: 0,
        discount: 10,
        cost: 9,
        realQuantity: 500,
        expirationDate: '05/11/2021'
      },
      {
        quantity: 500,
        _product: {
          name: 'PRODUCTO CON NOMBRE LARGO ESTE ES UN PRODUCTO DE PRUEBA'
        },
        price: 10.00,
        bono: 0,
        discount: 10,
        cost: 9,
        realQuantity: 500,
        expirationDate: '05/11/2021'
      },
      {
        quantity: 500,
        _product: {
          name: 'PRODUCTO CON NOMBRE LARGO ESTE ES UN PRODUCTO DE PRUEBA'
        },
        price: 10.00,
        bono: 0,
        discount: 10,
        cost: 9,
        realQuantity: 500,
        expirationDate: '05/11/2021'
      },
      {
        quantity: 500,
        _product: {
          name: 'PRODUCTO CON NOMBRE LARGO ESTE ES UN PRODUCTO DE PRUEBA'
        },
        price: 10.00,
        bono: 0,
        discount: 10,
        cost: 9,
        realQuantity: 500,
        expirationDate: '05/11/2021'
      },
      {
        quantity: 500,
        _product: {
          name: 'PRODUCTO CON NOMBRE LARGO ESTE ES UN PRODUCTO DE PRUEBA'
        },
        price: 10.00,
        bono: 0,
        discount: 10,
        cost: 9,
        realQuantity: 500,
        expirationDate: '05/11/2021'
      },
      {
        quantity: 500,
        _product: {
          name: 'PRODUCTO CON NOMBRE LARGO ESTE ES UN PRODUCTO DE PRUEBA'
        },
        price: 10.00,
        bono: 0,
        discount: 10,
        cost: 9,
        realQuantity: 500,
        expirationDate: '05/11/2021'
      },
      {
        quantity: 500,
        _product: {
          name: 'PRODUCTO CON NOMBRE LARGO ESTE ES UN PRODUCTO DE PRUEBA'
        },
        price: 10.00,
        bono: 0,
        discount: 10,
        cost: 9,
        realQuantity: 500,
        expirationDate: '05/11/2021'
      },
      {
        quantity: 500,
        _product: {
          name: 'PRODUCTO CON NOMBRE LARGO ESTE ES UN PRODUCTO DE PRUEBA'
        },
        price: 10.00,
        bono: 0,
        discount: 10,
        cost: 9,
        realQuantity: 500,
        expirationDate: '05/11/2021'
      },
      {
        quantity: 500,
        _product: {
          name: 'PRODUCTO CON NOMBRE LARGO ESTE ES UN PRODUCTO DE PRUEBA'
        },
        price: 10.00,
        bono: 0,
        discount: 10,
        cost: 9,
        realQuantity: 500,
        expirationDate: '05/11/2021'
      },
    ]
  }

  constructor(
    public dialogRef: MatDialogRef<DetailsPurchaseComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

  getTotal() {
    let total = 0;
    this.newPurchase.products.forEach(p => {
      const t = p.quantity * p.price;
      total += t;
    });
    return total;
  }

}
