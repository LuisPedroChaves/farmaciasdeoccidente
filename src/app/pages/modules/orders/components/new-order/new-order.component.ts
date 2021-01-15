import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OrderService } from '../../../../../core/services/httpServices/order.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { OrderItem } from '../../../../../core/models/Order';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss']
})
export class NewOrderComponent implements OnInit {

  loading = false;

  form = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    nit: new FormControl(null,  [Validators.required]),
    phone: new FormControl(null, ),
    address: new FormControl(null, ),
    town: new FormControl(null, ),
    department: new FormControl('Huehuetenango', ),
    details: new FormControl(null, [Validators.required]),
    payment: new FormControl('EFECTIVO', ),
    total: new FormControl(0, [Validators.required]),
    state: new FormControl('ORDERN', ),
    timeOrder: new FormControl(0, ),
  });

  constructor(public dialogRef: MatDialogRef<NewOrderComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  public orderService: OrderService,
  public toasty: ToastyService
  ) { }

  ngOnInit(): void {
  }

  saveClient() {
    if (this.form.invalid) { return; }
    this.loading = true;
    const order: OrderItem = {...this.form.value};
    this.orderService.createOrder(order).subscribe(data => {
      if (data.ok === true) {
        this.toasty.success('Orden creada exitosamente');
        this.dialogRef.close('ok');
        this.loading = false;
      } else {
        this.loading = false;
        this.toasty.error('Error al crear la orden');
      }
    }, err => {
      this.loading = false;
      this.toasty.error('Error al crear la orden');
    });
  }

}
