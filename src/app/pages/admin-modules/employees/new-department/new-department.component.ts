import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JobsService } from 'src/app/core/services/httpServices/jobs.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';

@Component({
  selector: 'app-new-department',
  templateUrl: './new-department.component.html',
  styleUrls: ['./new-department.component.scss']
})
export class NewDepartmentComponent implements OnInit {

  form = new FormGroup({
    name: new FormControl(null, Validators.required)
  });
  constructor(public jobService: JobsService, public toasty: ToastyService, public dialogRef: MatDialogRef<NewDepartmentComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if (this.data.role === 'edit') {
      this.form.controls.name.setValue(this.data.department.name);
    }
  }


  saveDepartment() {
    if (this.form.invalid) { return; }
    const dep = {...this.form.value };
    this.jobService.createDepartment(dep).subscribe(data => {
      this.toasty.success('Departamento Creado exitósamente');
      this.dialogRef.close(data);
    });
  }

  editDepartment() {
    if (this.form.invalid) { return; }
    const dep = {...this.form.value, _id: this.data.department._id };
    this.jobService.updateDepartment(dep).subscribe(data => {
      this.toasty.success('Departamento Modificado exitósamente');
      this.dialogRef.close(data);
    });
  }

}
