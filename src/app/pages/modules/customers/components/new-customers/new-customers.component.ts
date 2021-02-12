import { Component, OnInit, Inject, AfterContentInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/core/services/httpServices/customer.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { CustomerItem } from 'src/app/core/models/Customer';
import { Observable, Subscription } from 'rxjs';
import { UserItem } from 'src/app/core/models/User';
import { UserService } from 'src/app/core/services/httpServices/user.service';
import { map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-new-client',
  templateUrl: './new-customers.component.html',
  styleUrls: ['./new-customers.component.scss']
})
export class NewCustomersComponent implements OnInit, AfterContentInit, OnDestroy {

  loading = false;

  form = new FormGroup({
    code: new FormControl('', ),
    name: new FormControl(null, [Validators.required]),
    nit: new FormControl(null,  [Validators.required]),
    phone: new FormControl(null, ),
    address: new FormControl(null, ),
    town: new FormControl(null, ),
    department: new FormControl('Huehuetenango', ),
    company: new FormControl(null, ),
    transport: new FormControl(null,),
    limitCredit: new FormControl(null, [Validators.required]),
    limitDaysCredit: new FormControl(null, [Validators.required]),
    _seller: new FormControl(null, [Validators.required]),
  });

  usersSubscription: Subscription;
  sellers: UserItem[];

    // Autocompletado
    orderFind = false;
    customersSubscription: Subscription;
    customers: CustomerItem[];
    options: CustomerItem[] = [];
    filteredOptions: Observable<CustomerItem[]>;

  constructor(public dialogRef: MatDialogRef<NewCustomersComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  public customerService: CustomerService,
  public toasty: ToastyService,
  public userService: UserService
  ) { }

  ngOnInit(): void {
    this.customersSubscription = this.customerService.readData().subscribe(data => {
      this.customers = data.filter(customer => customer.code);
      this.options = [...this.customers];
    });

    this.filteredOptions = this.form.controls.code.valueChanges.pipe(startWith(''), map(value => this._filter(value)));

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
    this.form.controls.code.setValue('');
    this.form.controls.company.setValue('');
    this.form.controls.transport.setValue('');
    this.form.controls.limitCredit.setValue('');
    this.form.controls.limitDaysCredit.setValue('');
    this.form.controls._seller.setValue('');
  }

  saveClient() {
    if (this.form.invalid) { return; }
    this.loading = true;
    const client: CustomerItem = {...this.form.value};
    this.customerService.createCustomer(client).subscribe(data => {
      if (data.ok === true) {
        this.toasty.success('Cliente creado exitosamente');
        this.dialogRef.close('ok');
        this.loading = false;
      } else {
        this.loading = false;
        this.toasty.error('Error al crear el cliente');
      }
    }, err => {
      this.loading = false;
      this.toasty.error('Error al crear el cliente');
    });
  }

    // Autocompletado
    findThis(value) {
      if (value !== 'cf') {
        this.orderFind = false;
        const index = this.customers.findIndex(c => c.code === value);
        if (index > -1) {
          this.orderFind = true;
          this.form.controls.nit.setValue(this.customers[index].nit);
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
        }
      } else {
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
      }
    }

    private _filter(value: string): CustomerItem[] {
      if (value) {
        const filterValue = value.toLowerCase();
        return this.options.filter(option => option.code.toLowerCase().includes(filterValue));
      } else {
        return [];
      }
    }

}
