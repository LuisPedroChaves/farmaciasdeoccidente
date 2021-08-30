import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-adjust',
  templateUrl: './new-adjust.component.html',
  styleUrls: ['./new-adjust.component.scss']
})
export class NewAdjustComponent implements OnInit {

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
    public dialogRef: MatDialogRef<NewAdjustComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

}
