import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.scss']
})
export class NewEmployeeComponent implements OnInit {
  newEmployee: any = {
    _id: '',

    name: '',
    gender: '',

    dpi: '',
    birthDate: '',

    address: '',
    phone: '',

    _job: null,
    salary: 0,
  };
  private configSucces: any = {
    panelClass: ['style-succes'],
    duration: 2000,
    verticalPosition: 'top',
  };

  private configError: any = {
    panelClass: ['style-error'],
    duration: 2000,
    verticalPosition: 'top',
  };
  constructor(public dialogRef: MatDialogRef<NewEmployeeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
