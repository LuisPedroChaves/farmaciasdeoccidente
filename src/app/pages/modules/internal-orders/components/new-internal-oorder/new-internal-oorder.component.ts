import { Component, OnInit, AfterContentInit, OnDestroy, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';

@Component({
  selector: 'app-new-internal-oorder',
  templateUrl: './new-internal-oorder.component.html',
  styleUrls: ['./new-internal-oorder.component.scss']
})
export class NewInternalOorderComponent implements OnInit {

  loading = false;

  form = new FormGroup({
    _cellar: new FormControl(null, ),
    name: new FormControl(null, [Validators.required]),
    nit: new FormControl(null,  [Validators.required]),
    phone: new FormControl(null, [Validators.required]),
    address: new FormControl(null, [Validators.required]),
    town: new FormControl(null, ),
    department: new FormControl('Huehuetenango', ),
    details: new FormControl(null, [Validators.required]),
    payment: new FormControl('EFECTIVO', ),
    total: new FormControl('', [Validators.required]),
    state: new FormControl('ORDEN', ),
    timeOrder: new FormControl(0, ),
  });

  time: number = 0;
  display ;
  interval;

  constructor(
    public dialogRef: MatDialogRef<NewInternalOorderComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  // public orderService: OrderService,
  public toasty: ToastyService,
  ) { }

  ngOnInit(): void {
    // this.startTimer();
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.time === 0) {
        this.time++;
      } else {
        this.time++;
      }
      this.display=this.transform( this.time)
    }, 1000);
  }

  transform(value: number): string {
       const minutes: number = Math.floor(value / 60);
       return minutes + '.' + (value - minutes * 60);
  }

  saveClient() {
    if (this.form.invalid) { return; }
    this.loading = true;
    // this.form.get('_cellar').setValue(this.data.currentCellar);
    // this.form.get('timeOrder').setValue(this.display);
    // const order: OrderItem = {...this.form.value};
    // this.orderService.createOrder(order).subscribe(data => {
    //   if (data.ok === true) {
    //     this.toasty.success('Orden creada exitosamente');
    //     this.dialogRef.close('ok');
    //     this.loading = false;
    //   } else {
    //     this.loading = false;
    //     this.toasty.error('Error al crear la orden');
    //   }
    // }, err => {
    //   this.loading = false;
    //   this.toasty.error('Error al crear la orden');
    // });
  }

}
