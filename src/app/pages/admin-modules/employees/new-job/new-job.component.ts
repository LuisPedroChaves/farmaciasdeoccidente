import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-job',
  templateUrl: './new-job.component.html',
  styleUrls: ['./new-job.component.scss']
})
export class NewJobComponent implements OnInit {
  newJob: any = {
    _id: '',
    name: '',
    salaryType: '',
    baseSalary: 0
  };
  constructor(public dialogRef: MatDialogRef<NewJobComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  saveJob(): void {
    this.dialogRef.close(this.newJob);
  }
}