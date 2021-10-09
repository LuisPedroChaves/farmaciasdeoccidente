import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';

import { OrderService } from '../../../../../core/services/httpServices/order.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { OrderItem } from '../../../../../core/models/Order';
import { CustomerItem, CustomerAddressesItem } from '../../../../../core/models/Customer';
import { CustomerService } from '../../../../../core/services/httpServices/customer.service';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss']
})
export class NewOrderComponent implements OnInit {

  @ViewChild('search') search: ElementRef<HTMLInputElement>;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  loading = false;

  form = new FormGroup({
    _cellar: new FormControl(null,),
    name: new FormControl(null, [Validators.required]),
    nit: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [Validators.required]),
    address: new FormControl(null, [Validators.required]),
    town: new FormControl(null),
    department: new FormControl(null, [Validators.required]),
    details: new FormControl(null, [Validators.required]),
    payment: new FormControl('EFECTIVO',),
    sellerCode: new FormControl(''),
    total: new FormControl('', [Validators.required]),
    state: new FormControl('ORDEN',),
    timeOrder: new FormControl(0,),
  });
  selectedCustomer: CustomerItem = {
    _id: null,
    name: '',
    nit: '',
    phone: '',
    address: '',
    town: '',
    department: '',
    addresses: [],
    company: '',
    transport: '',
    limitCredit: 0,
    limitDaysCredit: 0
  };
  newAddress: CustomerAddressesItem = {
    address: '',
    town: '',
    department: 'Huehuetenango'
  };

  time: number = 0;
  display;
  interval;

  searchCustomersCtrl = new FormControl();
  filteredCostumers: CustomerItem[];
  isLoading = false;

  constructor(public dialogRef: MatDialogRef<NewOrderComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public orderService: OrderService,
    public toasty: ToastyService,
    public customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.startTimer();
    this.loadProducts();
    setTimeout(() => {
      this.search.nativeElement.focus();
    }, 500);
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.time === 0) {
        this.time++;
      } else {
        this.time++;
      }
      this.display = this.transform(this.time)
    }, 1000);
  }

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return minutes + '.' + (value - minutes * 60);
  }

  loadProducts(): void {
    this.searchCustomersCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.filteredCostumers = [];
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.customerService.search(value).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((data) => {
        this.filteredCostumers = data['customers'];
      });
  }

  getCustomer(customer: CustomerItem): string {
    return customer ? `${customer.phone} | ${customer.nit} | ${customer.name}` : '';
  }

  selectCustomer(customer: CustomerItem) {
    this.form.get('nit').setValue(customer.nit);
    this.form.get('phone').setValue(customer.phone);
    this.form.get('name').setValue(customer.name);
    this.selectedCustomer = customer;
    this.selectedCustomer.addresses.unshift({address: customer.address, town: customer.town, department: customer.department})
  }

  selectAddress(address: CustomerAddressesItem) {
    this.form.get('address').setValue(address.address);
    this.form.get('town').setValue(address.town);
    this.form.get('department').setValue(address.department);
  }

  addAddress() {
    this.selectedCustomer.addresses.push(this.newAddress);
    this.form.get('address').setValue(this.newAddress.address);
    this.form.get('town').setValue(this.newAddress.town);
    this.form.get('department').setValue(this.newAddress.department);
    this.newAddress = {
      address: '',
      town: '',
      department: 'Huehuetenango'
    };
    this.accordion.closeAll();
  }

  saveClient() {
    if (this.form.invalid) { return; }
    this.loading = true;
    this.form.get('_cellar').setValue(this.data.currentCellar);
    this.form.get('timeOrder').setValue(this.display);
    let order: OrderItem = { ...this.form.value };
    this.selectedCustomer.addresses.splice(0, 1);
    order._customer = this.selectedCustomer;
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

  clear() {
    this.form.reset({
      payment: 'EFECTIVO',
      state: 'ORDEN'
    });
    this.selectedCustomer = {
      _id: null,
      name: '',
      nit: '',
      phone: '',
      address: '',
      town: '',
      department: '',
      addresses: [],
      company: '',
      transport: '',
      limitCredit: 0,
      limitDaysCredit: 0
    };
    this.newAddress = {
      address: '',
      town: '',
      department: 'Huehuetenango'
    };
  }
}
