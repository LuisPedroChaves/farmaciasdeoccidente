import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JobItem } from 'src/app/core/models/Jobs';
import { JobsService } from 'src/app/core/services/httpServices/jobs.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { NewDepartmentComponent } from '../new-department/new-department.component';

@Component({
  selector: 'app-new-job',
  templateUrl: './new-job.component.html',
  styleUrls: ['./new-job.component.scss']
})
export class NewJobComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl(null, Validators.required),
    _jobDepartment: new FormControl(null, Validators.required),
  });

  departments: any[] = [];
  smallScreen: boolean;
  constructor(public dialogRef: MatDialogRef<NewJobComponent>, public jobService: JobsService, public toasty: ToastyService,
              @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.departments = this.data.departments;
    this.smallScreen = this.data.smallScreen;

    if (this.data.role === 'edit') {
      this.form = new FormGroup({
        name: new FormControl(this.data.job.name, Validators.required),
        _jobDepartment: new FormControl(this.data.job._jobDepartment, Validators.required),
      });
    }
  }

  saveJob(): void {
    if (this.form.invalid) { return; }
    const job: JobItem = {...this.form.value};
    this.jobService.createJob(job).subscribe(data => {

      this.dialogRef.close(true);
    });
  }

  saveJobEdit(): void {
    if (this.form.invalid) { return; }
    const job: JobItem = {...this.form.value, _id: this.data.job._id};
    this.jobService.updateJob(job).subscribe(data => {

      this.dialogRef.close(true);
    });
  }


  addDepartment() {
    const dialogRef = this.dialog.open(NewDepartmentComponent, {
      width: this.smallScreen ? '100%' : '350px',
      disableClose: true,
      data: { role: 'new' },
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data !== undefined) {
        this.departments.push(data.jobDepartment);
        this.form.controls.department.setValue(data.jobDepartment._id);
      }
    });
  }
}