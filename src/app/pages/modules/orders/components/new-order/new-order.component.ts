import { Component, Inject, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OrderService } from '../../../../../core/services/httpServices/order.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { OrderItem } from '../../../../../core/models/Order';
import { CustomerItem } from '../../../../../core/models/Customer';
import { CustomerService } from '../../../../../core/services/httpServices/customer.service';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss']
})
export class NewOrderComponent implements OnInit, AfterContentInit, OnDestroy {

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
    sellerCode: new FormControl(''),
    total: new FormControl('', [Validators.required]),
    state: new FormControl('ORDEN', ),
    timeOrder: new FormControl(0, ),
  });

  time: number = 0;
  display ;
  interval;

  // Autocompletado
  orderFind = false;
  customersSubscription: Subscription;
  customers: CustomerItem[];
  options: CustomerItem[] = [];
  filteredOptions: Observable<CustomerItem[]>;

  constructor(public dialogRef: MatDialogRef<NewOrderComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  public orderService: OrderService,
  public toasty: ToastyService,
  public customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.startTimer();
    this.customersSubscription = this.customerService.readData().subscribe(data => {
      this.customers = data.filter(customer => !customer.code);
      const cf: CustomerItem = { _id: null, name: '', address: null, nit: 'CF', phone: null, town: null, department: null, company: null, transport: null, limitCredit: null, limitDaysCredit: null };
      this.options = [...this.customers];
      this.options.push(cf);
    });

    this.filteredOptions = this.form.controls.nit.valueChanges.pipe(startWith(''), map(value => this._filter(value)));
  }

  ngAfterContentInit() {
    this.customerService.loadData();
  }

  ngOnDestroy() {
    this.customersSubscription?.unsubscribe();
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

  // Autocompletado
  findThis(value) {
    if (value !== 'cf'){
      this.orderFind = false;
      const index = this.customers.findIndex(c => c.nit === value);
      if (index > -1) {
        this.orderFind = true;
        this.form.controls.name.setValue(this.customers[index].name);
        this.form.controls.phone.setValue(this.customers[index].phone);
        this.form.controls.address.setValue(this.customers[index].address);
        this.form.controls.town.setValue(this.customers[index].town);
        this.form.controls.department.setValue(this.customers[index].department);
      }
    } else {
      this.form.controls.name.setValue('');
      this.form.controls.phone.setValue('');
      this.form.controls.address.setValue('');
      this.form.controls.town.setValue('');
      this.form.controls.department.setValue('Huehuetenango');
    }
  }

  private _filter(value: string): CustomerItem[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.options.filter(option => option.nit.toLowerCase().includes(filterValue));
    } else {
      return [];
    }

  }

  saveClient() {
    if (this.form.invalid) { return; }
    this.loading = true;
    this.form.get('_cellar').setValue(this.data.currentCellar);
    this.form.get('timeOrder').setValue(this.display);
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
