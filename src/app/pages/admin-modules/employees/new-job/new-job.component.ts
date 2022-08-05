import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-job',
  templateUrl: './new-job.component.html',
  styleUrls: ['./new-job.component.scss']
})
export class NewJobComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl(null, Validators.required),
    department: new FormControl(null, Validators.required),
  });

  departments: any[] = [];

  constructor(public dialogRef: MatDialogRef<NewJobComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.departments = this.data.departments;
    if (this.data.role === 'edit') {
      this.form = new FormGroup({
        name: new FormControl(this.data.job.name, Validators.required),
        department: new FormControl(this.data.job.department, Validators.required),
      });
    }
  }

  saveJob(): void {
    this.dialogRef.close(this.form.value);
  }
}