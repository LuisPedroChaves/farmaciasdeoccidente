import { Component, OnInit, Inject, AfterContentInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomerService } from 'src/app/core/services/httpServices/customer.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { CustomerItem } from 'src/app/core/models/Customer';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { Observable, Subscription } from 'rxjs';
import { UserItem } from 'src/app/core/models/User';
import { map, startWith } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/httpServices/user.service';


@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss']
})
export class EditCustomerComponent implements OnInit, AfterContentInit, OnDestroy {

  editMode = false;
  loading = false;

  form = new FormGroup({
    code: new FormControl('', [Validators.required]),
    name: new FormControl(null, [Validators.required]),
    nit: new FormControl(null, [Validators.required]),
    phone: new FormControl(null),
    address: new FormControl(null),
    town: new FormControl(null),
    department: new FormControl(null),
    company: new FormControl(null,),
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

  constructor(public dialogRef: MatDialogRef<EditCustomerComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public customerService: CustomerService,
    public toasty: ToastyService,
  public userService: UserService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      code: new FormControl(this.data.customer.code, [Validators.required]),
      name: new FormControl(this.data.customer.name, [Validators.required]),
      nit: new FormControl(this.data.customer.nit, [Validators.required]),
      address: new FormControl(this.data.customer.address),
      phone: new FormControl(this.data.customer.phone),
      town: new FormControl(this.data.customer.town),
      department: new FormControl(this.data.customer.department),
      company: new FormControl(this.data.customer.company),
      transport: new FormControl(this.data.customer.transport),
      limitCredit: new FormControl(this.data.customer.limitCredit),
      limitDaysCredit: new FormControl(this.data.customer.limitDaysCredit),
      _seller: new FormControl(this.data.customer._seller)
    });
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

  saveCustomer() {
    if (this.form.invalid) { return; }
    this.loading = true;
    const customer: CustomerItem = { ...this.form.value, _id: this.data.customer._id };
    this.customerService.updateCustomer(customer).subscribe(data => {
      if (data.ok === true) {
        this.toasty.success('Cliente editado exitosamente');
        this.dialogRef.close('ok');
        this.loading = false;
      } else {
        this.loading = false;
        this.toasty.error('Error al editar el cliente');
      }
    }, error => {
      this.loading = false;
      this.toasty.error('Error al editar el cliente');
    });
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Eliminar cliente', message: '¿Confirma que desea eliminar el cliente ' + this.data.customer.name + '?' },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === true) {
          this.loading = true;
          this.customerService.deleteCustomer(this.data.customer).subscribe(data => {
            this.toasty.success('cliente eliminado exitosamente');
            this.customerService.loadData();
            this.dialogRef.close();
            this.loading = false;
          }, error => {
            this.loading = false;
            this.toasty.error('Error al eliminar el cliente');
          });
        }
      }
    });
  }

      // Autocompletado
      findThis(value) {
        if (value !== 'cf') {
          this.orderFind = false;
          const index = this.customers.findIndex(c => c.code === value);
          if (index > -1) {
            this.orderFind = true;
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
