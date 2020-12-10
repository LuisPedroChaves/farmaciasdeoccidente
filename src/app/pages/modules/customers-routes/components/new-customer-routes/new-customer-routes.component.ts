import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-new-client',
  templateUrl: './new-customer-routes.component.html',
  styleUrls: ['./new-customer-routes.component.scss']
})
export class NewCustomerRoutesComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    nit: new FormControl(null,  [Validators.required]),
    address: new FormControl(null, ),
  });
  constructor(public dialogRef: MatDialogRef<NewCustomerRoutesComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
