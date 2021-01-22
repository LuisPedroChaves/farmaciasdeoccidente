import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CustomerItem } from 'src/app/core/models/Customer';
import { OrderItem } from 'src/app/core/models/Order';
import { CustomerService } from 'src/app/core/services/httpServices/customer.service';
import { OrderService } from 'src/app/core/services/httpServices/order.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';

@Component({
  selector: 'app-new-sale',
  templateUrl: './new-sale.component.html',
  styleUrls: ['./new-sale.component.scss']
})
export class NewSaleComponent implements OnInit {

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

  // Autocompletado
  orderFind = false;
  customersSubscription: Subscription;
  customers: CustomerItem[];
  options: CustomerItem[] = [];
  filteredOptions: Observable<CustomerItem[]>;

  constructor(
    public dialogRef: MatDialogRef<NewSaleComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public orderService: OrderService,
    public toasty: ToastyService,
    public customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.customersSubscription = this.customerService.readData().subscribe(data => {
      this.customers = data;
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
