import { AfterContentInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
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
  @ViewChild('findInput')
  findInput: ElementRef<HTMLInputElement>;

  loading = false;

  form = new FormGroup({
    _cellar: new FormControl(null,),
    _customer: new FormControl(null),
    _seller: new FormControl(null, [Validators.required]),
    date: new FormControl(new Date(), [Validators.required]),
    noBill: new FormControl(null, [Validators.required]),
    total: new FormControl('', [Validators.required]),
  });
  selectedCustomer: CustomerItem;
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

    setTimeout(() => {
      this.findInput.nativeElement.focus();
    }, 500);
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
    const CUSTOMER = this.customers.find(c => c.code === code);
    this.selectedCustomer = CUSTOMER;
    if (CUSTOMER) {
      this.form.controls["_seller"].setValue(CUSTOMER._seller._id)
      this.loading = true;
      this.customerService.getCustomer(CUSTOMER._id).subscribe(data => {
        this.timeAvaliable = data.timeAvaliable;
        this.credit = data.credit;
        this.loading = false;
      });
    }
  }

  clearCustomer() {
    this.selectedCustomer = null;
    this.timeAvaliable = true;
    this.credit = 0;
    this._customer.setValue('')
  }

  resetForm(): void {
    this._customer.setValue('')

    this.form.controls._seller.setValue('');
    this.form.controls.date.setValue(new Date());
    this.form.controls.noBill.setValue('');
    this.form.controls.total.setValue('');

    this.selectedCustomer = null;
    this.timeAvaliable = true;
    this.credit = 0;

    this.findInput.nativeElement.focus();
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
    this.form.get('_customer').setValue(this.selectedCustomer);
    const sale: any = { ...this.form.value };
    this.saleService.createSale(sale).subscribe(data => {
      if (data.ok === true) {
        this.customerService.loadData();
        this.toastyService.success('Venta creada exitosamente');
        this.resetForm()
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
