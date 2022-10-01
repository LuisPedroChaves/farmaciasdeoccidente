import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeJobItem } from 'src/app/core/models/EmployeeJob';

@Component({
  selector: 'app-request-dialog',
  templateUrl: './request-dialog.component.html',
  styleUrls: ['./request-dialog.component.scss']
})
export class RequestDialogComponent implements OnInit {
  employeeJobs: EmployeeJobItem[] = [];

  form = new FormGroup({
    _employeeJob: new FormControl({value: null, disabled: true}, Validators.required),
    date: new FormControl(new Date(), Validators.required),
    type: new FormControl(null, Validators.required),
    hours: new FormControl(null, Validators.required),
    amount: new FormControl(null, Validators.required),
    approved: new FormControl(false, Validators.required),
    hasDiscount: new FormControl(false, Validators.required),
    applied: new FormControl(false, Validators.required),
  });
  constructor(public dialogRef: MatDialogRef<RequestDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.employeeJobs =  this.data.employeeJobs;
    this.form.controls.type.setValue(this.data.type);
  }



  save() {
    this.dialogRef.close(true);
  }

  saveEdit() {
    this.dialogRef.close(true);
  }

}
