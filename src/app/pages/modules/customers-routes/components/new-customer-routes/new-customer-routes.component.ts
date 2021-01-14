import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomerItem } from '../../../../../core/models/Customer';
import { CustomerService } from '../../../../../core/services/httpServices/customer.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
@Component({
  selector: 'app-new-client',
  templateUrl: './new-customer-routes.component.html',
  styleUrls: ['./new-customer-routes.component.scss']
})
export class NewCustomerRoutesComponent implements OnInit {

  loading = false;

  form = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    nit: new FormControl(null,  [Validators.required]),
    phone: new FormControl(null, ),
    address: new FormControl(null, ),
    town: new FormControl(null, ),
    department: new FormControl('Huehuetenango', ),
  });

  constructor(public dialogRef: MatDialogRef<NewCustomerRoutesComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  public customerService: CustomerService,
  public toasty: ToastyService
  ) { }

  ngOnInit(): void {
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

}
