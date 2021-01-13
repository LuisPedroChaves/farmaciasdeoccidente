import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-customer-routes.component.html',
  styleUrls: ['./edit-customer-routes.component.scss']
})
export class EditCustomerRoutesComponent implements OnInit {
  editMode = false;
  form = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    nit: new FormControl(null,  [Validators.required]),
    address: new FormControl(null),
  });
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<EditCustomerRoutesComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog) { }

  ngOnInit(): void {
    console.log(this.data);
    this.form = new FormGroup({
      name: new FormControl(this.data.client.name, [Validators.required]),
      nit: new FormControl(this.data.client.nit,  [Validators.required]),
      address: new FormControl(this.data.client.address),
      phone: new FormControl(this.data.client.phone),
      town: new FormControl(this.data.client.town),
      department: new FormControl(this.data.client.department),
      company: new FormControl(this.data.client.company),
      transport: new FormControl(this.data.client.transport),
      limitCredit: new FormControl(this.data.client.limitCredit),
      limitDaysCredits: new FormControl(this.data.client.limitDaysCredits),
    });
  }
}
