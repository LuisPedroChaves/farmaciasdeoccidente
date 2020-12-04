import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-new-client',
  templateUrl: './new-customers.component.html',
  styleUrls: ['./new-customers.component.scss']
})
export class NewCustomersComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    nit: new FormControl(null,  [Validators.required]),
    address: new FormControl(null, ),
  });
  constructor(public dialogRef: MatDialogRef<NewCustomersComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
