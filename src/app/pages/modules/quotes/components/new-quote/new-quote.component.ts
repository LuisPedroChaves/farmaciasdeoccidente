import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators, FormBuilder, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';

import { CellarItem } from 'src/app/core/models/Cellar';
import { CustomerAddressesItem, CustomerItem } from 'src/app/core/models/Customer';
import { OrderItem } from 'src/app/core/models/Order';
import { ProductItem } from 'src/app/core/models/Product';
import { PurchaseDetailItem, PurchaseItem } from 'src/app/core/models/Purchase';
import { CustomerService } from 'src/app/core/services/httpServices/customer.service';
import { OrderService } from 'src/app/core/services/httpServices/order.service';
import { ProductService } from 'src/app/core/services/httpServices/product.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';

@Component({
  selector: 'app-new-quote',
  templateUrl: './new-quote.component.html',
  styleUrls: ['./new-quote.component.scss']
})
export class NewQuoteComponent implements OnInit {
  @ViewChild('search') search: ElementRef<HTMLInputElement>;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  smallScreen = window.innerWidth < 960 ? true : false;
  loading = false;
  currentCellar: CellarItem;

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

  get detailForm(): FormArray {
    return this.form.get('detail') as FormArray;
  }

  form = new FormGroup({
    _cellar: new FormControl(null,),
    name: new FormControl(null, [Validators.required]),
    nit: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [Validators.required]),
    address: new FormControl(null, [Validators.required]),
    town: new FormControl(null),
    department: new FormControl(null, [Validators.required]),
    detail: this.FormBuilder.array([]),
    details: new FormControl(null),
    payment: new FormControl('EFECTIVO',),
    sellerCode: new FormControl(''),
    total: new FormControl('', [Validators.required]),
    state: new FormControl('ORDEN',),
    timeOrder: new FormControl(0,),
  });

  formDetail = new FormGroup({
    _product: new FormControl(null, Validators.required),
    quantity: new FormControl('', Validators.required),
    price: new FormControl(0),
    max: new FormControl(0)
  });

  filteredProducts: Observable<ProductItem[]>[] = [];
  isLoading = false;

  displayedColumns: string[] = ['quantity', '_product', 'price', 'remove'];
  dataSource = new BehaviorSubject<AbstractControl[]>([]);

  constructor(
    public orderService: OrderService,
    public customerService: CustomerService,
    public productService: ProductService,
    public toasty: ToastyService,
    private router: Router,
    public dialog: MatDialog,
    private FormBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
    this.startTimer();
    this.loadProducts();
    setTimeout(() => {
      this.search.nativeElement.focus();
    }, 1000);
    this.addRow(null);
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

  clear() {
    this.form.reset({
      payment: 'EFECTIVO',
      state: 'ORDEN'
    });
    this.searchCustomersCtrl.reset('');
    this.search.nativeElement.focus();
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

  getShowDescription(product: ProductItem): string {
    return product ? product.description : '';
  }

  isObject(control: FormControl): ValidatorFn {
    return typeof control.value === 'object' ? null : control.value;
  }

  manageProductControl(index: number) {
    this.detailForm.at(index).get('_product').valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.filteredProducts = [];
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.productService.search(value).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((data) => {
        this.filteredProducts[index] = data['products'];
      });
  }

  addRow(product: any, index?: number): void {

    if (product) {

      const DUPLICATE: PurchaseDetailItem[] = this.detailForm.value.filter(
        (d) =>
          d._product && d._product._id === product._id &&
          d._product.presentations._id === product.presentations._id
      );

      if (DUPLICATE.length > 1) {
        this.toasty.toasty('warning', '¡El producto ya fue agregado!');
        return;
      }

      this.detailForm.at(index).get('price').setValue( product.presentations.cf_price)
    }

    const NEW_DETAIL: FormGroup = this.FormBuilder.group({
      quantity: new FormControl(null, Validators.required),
      _product: new FormControl(null, [
        Validators.required,
        this.isObject
      ]),
      price: new FormControl(0),
      max: new FormControl(0),
    });
    this.detailForm.push(NEW_DETAIL);

    this.manageProductControl(this.detailForm.length - 1);
    this.dataSource.next(this.detailForm.controls);
  }

  removeRow(index: number): void {
    this.detailForm.removeAt(index);
    this.dataSource.next(this.detailForm.controls);
    this.filteredProducts = [];

    this.detailForm.value.forEach((detail, index) => {
      this.manageProductControl(index);
    });
  }

  getTotal(): number {
    let total = 0;

    this.detailForm.controls.forEach((group: FormGroup) => {
      const CONTROL = group.controls;

      if (CONTROL.quantity.value) {
        total += +CONTROL.quantity.value * +CONTROL.price.value;
      } else {
        total += +CONTROL.price.value;
      }
    });

    this.form.get('total').setValue(total);
    return total;
  }

  saveOrder() {
    if (this.form.invalid) { return; }
    this.loading = true;
    this.form.get('_cellar').setValue(this.currentCellar._id);
    this.form.get('timeOrder').setValue(this.display);
    let order: OrderItem = { ...this.form.value };
    this.selectedCustomer.addresses.splice(0, 1);
    order._customer = this.selectedCustomer;
    this.orderService.createQuote(order).subscribe(data => {
      if (data.ok === true) {
        this.toasty.success('Orden creada exitosamente');
        this.router.navigate(['/quotes']);
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
