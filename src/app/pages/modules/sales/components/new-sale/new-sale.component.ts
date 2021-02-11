import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CustomerItem } from 'src/app/core/models/Customer';
import { CustomerService } from 'src/app/core/services/httpServices/customer.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { UserItem } from '../../../../../core/models/User';
import { SaleService } from '../../../../../core/services/httpServices/sale.service';
import { UserService } from '../../../../../core/services/httpServices/user.service';

@Component({
  selector: 'app-new-sale',
  templateUrl: './new-sale.component.html',
  styleUrls: ['./new-sale.component.scss']
})
export class NewSaleComponent implements OnInit {

  loading = false;

  form = new FormGroup({
    _cellar: new FormControl(null,),
    name: new FormControl(null, [Validators.required]),
    nit: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [Validators.required]),
    address: new FormControl(null, [Validators.required]),
    town: new FormControl(null,),
    department: new FormControl('Huehuetenango',),
    company: new FormControl(null,),
    transport: new FormControl(null,),
    limitCredit: new FormControl(null, [Validators.required]),
    limitDaysCredit: new FormControl(null, [Validators.required]),
    _seller: new FormControl(null, [Validators.required]),
    date: new FormControl(new Date(), [Validators.required]),
    noBill: new FormControl(null, [Validators.required]),
    total: new FormControl('', [Validators.required]),
  });

  idCustomer = null;
  timeAvaliable = true;
  credit = 0;

  usersSubscription: Subscription;
  sellers: UserItem[];

  // Autocompletado
  orderFind = false;
  customersSubscription: Subscription;
  customers: CustomerItem[];
  options: CustomerItem[] = [];
  filteredOptions: Observable<CustomerItem[]>;

  constructor(
    public dialogRef: MatDialogRef<NewSaleComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public toasty: ToastyService,
    public customerService: CustomerService,
    public saleService: SaleService,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.customersSubscription = this.customerService.readData().subscribe(data => {
      this.customers = data;
      this.options = [...this.customers];
    });

    this.filteredOptions = this.form.controls.nit.valueChanges.pipe(startWith(''), map(value => this._filter(value)));

    this.usersSubscription = this.userService.readData().subscribe(data => {
      this.sellers = data.filter(user => user._role.type === 'SELLER');
    });
  }

  ngAfterContentInit() {
    this.customerService.loadData();
    this.userService.loadData();
  }

  ngOnDestroy() {
    this.customersSubscription?.unsubscribe();
    this.usersSubscription?.unsubscribe();
  }

  clear() {
    this.form.controls.nit.setValue('');
    this.form.controls.name.setValue('');
    this.form.controls.phone.setValue('');
    this.form.controls.address.setValue('');
    this.form.controls.town.setValue('');
    this.form.controls.department.setValue('Huehuetenango');
    this.form.controls.company.setValue('');
    this.form.controls.transport.setValue('');
    this.form.controls.limitCredit.setValue('');
    this.form.controls.limitDaysCredit.setValue('');
    this.form.controls._seller.setValue('');
    this.form.controls.date.setValue('');
    this.form.controls.noBill.setValue('');
    this.form.controls.total.setValue('');

    this.idCustomer = null;
    this.timeAvaliable = true;
    this.credit = 0;
  }

  // Autocompletado
  findThis(value) {
    if (value !== 'cf') {
      this.orderFind = false;
      const index = this.customers.findIndex(c => c.nit === value);
      if (index > -1) {
        this.loading = true;
        this.orderFind = true;
        this.form.controls.name.setValue(this.customers[index].name);
        this.form.controls.phone.setValue(this.customers[index].phone);
        this.form.controls.address.setValue(this.customers[index].address);
        this.form.controls.town.setValue(this.customers[index].town);
        this.form.controls.department.setValue(this.customers[index].department);
        this.form.controls.company.setValue(this.customers[index].company);
        this.form.controls.transport.setValue(this.customers[index].transport);
        this.form.controls.limitCredit.setValue(this.customers[index].limitCredit);
        this.form.controls.limitDaysCredit.setValue(this.customers[index].limitDaysCredit);
        this.form.controls._seller.setValue(this.customers[index]._seller._id);
        this.idCustomer = this.customers[index]._id;
        this.customerService.getCustomer(this.idCustomer).subscribe(data => {
          this.timeAvaliable = data.timeAvaliable;
          this.credit = data.credit;
          this.loading = false;
        });
      }
    } else {
      this.form.controls.name.setValue('');
      this.form.controls.phone.setValue('');
      this.form.controls.address.setValue('');
      this.form.controls.town.setValue('');
      this.form.controls.department.setValue('Huehuetenango');
      this.form.controls.company.setValue('');
      this.form.controls.transport.setValue('');
      this.form.controls.limitCredit.setValue('');
      this.form.controls.limitDaysCredit.setValue('');
      this.form.controls._seller.setValue('');
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

  saveSale() {
    if (this.form.invalid) { return; }
    this.loading = true;
    this.form.get('_cellar').setValue(this.data.currentCellar);
    const sale: any = { ...this.form.value };
    this.saleService.createSale(sale).subscribe(data => {
      if (data.ok === true) {
        this.toasty.success('Venta creada exitosamente');
        this.dialogRef.close('ok');
        this.loading = false;
      } else {
        this.loading = false;
        this.toasty.error('Error al crear la venta');
      }
    }, err => {
      this.loading = false;
      this.toasty.error('Error al crear la venta');
    });
  }

}
