import { AfterContentInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CellarItem } from 'src/app/core/models/Cellar';

import { CustomerItem } from 'src/app/core/models/Customer';
import { UserItem } from 'src/app/core/models/User';
import { CustomerService } from 'src/app/core/services/httpServices/customer.service';
import { SaleService } from 'src/app/core/services/httpServices/sale.service';
import { UserService } from 'src/app/core/services/httpServices/user.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';

@Component({
  selector: 'app-new-sale',
  templateUrl: './new-sale.component.html',
  styleUrls: ['./new-sale.component.scss']
})
export class NewSaleComponent implements OnInit, AfterContentInit, OnDestroy {

  @Input()
  currentCellar: CellarItem;

  @Output()
  close = new EventEmitter();

  loading = false;

  form = new FormGroup({
    _cellar: new FormControl(null,),
    name: new FormControl(null, [Validators.required]),
    nit: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [Validators.required]),
    address: new FormControl(null, [Validators.required]),
    town: new FormControl(null,),
    department: new FormControl('Huehuetenango',),
    code: new FormControl('', [Validators.required]),
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

  customerSubscription: Subscription;
  customers: CustomerItem[];
  filteredOptions: Observable<CustomerItem[]>;
  _customer = new FormControl(null, Validators.required);

  userSubscription: Subscription;
  sellers: UserItem[];

  constructor(
    private customerService: CustomerService,
    private userService: UserService,
    private toastyService: ToastyService,
    private saleService: SaleService
  ) {
    this.customerSubscription = this.customerService.readData().subscribe((data) => {
      this.customers = data.filter(customer => customer.code);
    });
  }

  ngOnInit(): void {
    this.filteredOptions = this._customer.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCustomers(value))
    );

    this.userSubscription = this.userService.readData().subscribe(data => {
      this.sellers = data.filter(user => user._role.type === 'SELLER');
    });
  }

  ngAfterContentInit(): void {
    this.customerService.loadData();
    this.userService.loadData();
  }

  ngOnDestroy(): void {
    this.customerSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }

  private _filterCustomers(value: string): CustomerItem[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.customers.filter((option) =>
        option.code.toLowerCase().includes(filterValue) || option.name.toLowerCase().includes(filterValue)
      );
    } else {
      return [];
    }
  }

  selected(code: string) {
    const INDEX = this.customers.findIndex(c => c.code === code);
    if (INDEX > -1) {
      this.loading = true;
      this.form.controls.code.setValue(this.customers[INDEX].code);
      this.form.controls.nit.setValue(this.customers[INDEX].nit);
      this.form.controls.name.setValue(this.customers[INDEX].name);
      this.form.controls.phone.setValue(this.customers[INDEX].phone);
      this.form.controls.address.setValue(this.customers[INDEX].address);
      this.form.controls.town.setValue(this.customers[INDEX].town);
      this.form.controls.department.setValue(this.customers[INDEX].department);
      this.form.controls.company.setValue(this.customers[INDEX].company);
      this.form.controls.transport.setValue(this.customers[INDEX].transport);
      this.form.controls.limitCredit.setValue(this.customers[INDEX].limitCredit);
      this.form.controls.limitDaysCredit.setValue(this.customers[INDEX].limitDaysCredit);
      this.form.controls._seller.setValue(this.customers[INDEX]._seller._id);
      this.idCustomer = this.customers[INDEX]._id;
      this.customerService.getCustomer(this.idCustomer).subscribe(data => {
        this.timeAvaliable = data.timeAvaliable;
        this.credit = data.credit;
        this.loading = false;
      });
    }
    else {
      this.resetForm();
    }
  }

  resetForm(): void {
    this._customer.setValue('')

    this.form.controls.nit.setValue('');
    this.form.controls.name.setValue('');
    this.form.controls.phone.setValue('');
    this.form.controls.address.setValue('');
    this.form.controls.town.setValue('');
    this.form.controls.department.setValue('Huehuetenango');
    this.form.controls.code.setValue('');
    this.form.controls.company.setValue('');
    this.form.controls.transport.setValue('');
    this.form.controls.limitCredit.setValue('');
    this.form.controls.limitDaysCredit.setValue('');
    this.form.controls._seller.setValue('');
    this.form.controls.date.setValue(new Date());
    this.form.controls.noBill.setValue('');
    this.form.controls.total.setValue('');

    this.idCustomer = null;
    this.timeAvaliable = true;
    this.credit = 0;
  }

  save(): void {
    if (this.form.invalid) { return; }
    this.credit = parseFloat(this.credit.toFixed(2));
    if (parseFloat(this.form.get('total').value) > this.credit) {
      this.toastyService.error('No hay suficiente crédito disponible');
      return;
    }
    this.loading = true;
    this.form.get('_cellar').setValue(this.currentCellar);
    const sale: any = { ...this.form.value };
    this.saleService.createSale(sale).subscribe(data => {
      if (data.ok === true) {
        this.toastyService.success('Venta creada exitosamente');
        this.loading = false;
      } else {
        this.loading = false;
        this.toastyService.error('Error al crear la venta');
      }
    }, err => {
      this.loading = false;
      this.toastyService.error('Error al crear la venta');
    });
  }

}
