import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-employee-job',
  templateUrl: './new-employee-job.component.html',
  styleUrls: ['./new-employee-job.component.scss']
})
export class NewEmployeeJobComponent implements OnInit {
  jobs: any[] = [];
  constructor(public dialogRef: MatDialogRef<NewEmployeeJobComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.jobs = this.data.jobs;
  }




  addJob() {
    this.dialogRef.close();
  }

}
