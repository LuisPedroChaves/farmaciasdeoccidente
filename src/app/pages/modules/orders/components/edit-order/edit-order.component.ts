import { Component, Inject, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { OrderService } from '../../../../../core/services/httpServices/order.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { OrderItem } from '../../../../../core/models/Order';
import { CustomerItem } from 'src/app/core/models/Customer';
import { CustomerService } from '../../../../../core/services/httpServices/customer.service';
@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss']
})
export class EditOrderComponent implements OnInit, AfterContentInit, OnDestroy {

  loading = false;

  form = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    nit: new FormControl(null,  [Validators.required]),
    phone: new FormControl(null, [Validators.required]),
    address: new FormControl(null, [Validators.required]),
    town: new FormControl(null, ),
    department: new FormControl('Huehuetenango', ),
    details: new FormControl(null, [Validators.required]),
    payment: new FormControl('EFECTIVO', ),
    total: new FormControl('', [Validators.required]),
  });

    // Autocompletado
    orderFind = false;
    customersSubscription: Subscription;
    customers: CustomerItem[];
    options: CustomerItem[] = [];
    filteredOptions: Observable<CustomerItem[]>;

  constructor(
    public dialogRef: MatDialogRef<EditOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public orderService: OrderService,
    public toasty: ToastyService,
    public customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(this.data.order.name, [Validators.required]),
      nit: new FormControl(this.data.order.nit,  [Validators.required]),
      phone: new FormControl(this.data.order.phone, [Validators.required]),
      address: new FormControl(this.data.order.address, [Validators.required]),
      town: new FormControl(this.data.order.town, ),
      department: new FormControl(this.data.order.department, ),
      details: new FormControl(this.data.order.details, [Validators.required]),
      payment: new FormControl(this.data.order.payment, ),
      total: new FormControl(this.data.order.total, [Validators.required]),
    });
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
    const order: OrderItem = {...this.form.value, _id: this.data.order._id, _cellar: this.data.order._cellar._id};
    this.orderService.updateOrder(order).subscribe(data => {
      if (data.ok === true) {
        this.toasty.success('Orden editada exitosamente');
        this.dialogRef.close('ok');
        this.loading = false;
      } else {
        this.loading = false;
        this.toasty.error('Error al editar la orden');
      }
    }, error => {
      this.loading = false;
      this.toasty.error('Error al editar la orden');
    });
  }
}
