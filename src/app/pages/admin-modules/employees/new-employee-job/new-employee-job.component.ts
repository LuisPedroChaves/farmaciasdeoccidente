import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileInput } from 'ngx-material-file-input';
import { EmployeeItem } from 'src/app/core/models/Employee';
import { EmployeeJobItem } from 'src/app/core/models/EmployeeJob';
import { EmployeeService } from 'src/app/core/services/httpServices/employee.service';
import { UploadFileService } from 'src/app/core/services/httpServices/upload-file.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';

@Component({
  selector: 'app-new-employee-job',
  templateUrl: './new-employee-job.component.html',
  styleUrls: ['./new-employee-job.component.scss']
})
export class NewEmployeeJobComponent implements OnInit {
  jobs: any[] = [];
  changed: boolean = false;
  form = new FormGroup({
    _employee: new FormControl(null, Validators.required),
    _job: new FormControl(null, Validators.required),
    salaryPerHour: new FormControl(null, Validators.required),
    monthlyHours: new FormControl(null, Validators.required),
    initialSalary: new FormControl(null, Validators.required),
    salaryExtraHours: new FormControl(null, Validators.required),
    lawBonus: new FormControl(false, Validators.required),
    bonus: new FormControl(null, Validators.required),
    startDate: new FormControl(null, Validators.required),
    endDate: new FormControl(null, Validators.required),
    
    contractType: new FormControl(null, Validators.required),
    contract: new FormControl(null),
    paymentType: new FormControl(null, Validators.required),
    workPlace: new FormControl(null),
    workingDay: new FormControl(null),
  });
  employee: EmployeeItem;
  
  constructor(public dialogRef: MatDialogRef<NewEmployeeJobComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public uploadFileService: UploadFileService, public employeeService: EmployeeService, public toasty: ToastyService) { }

  ngOnInit(): void {
    this.jobs = this.data.jobs;
    this.employee = this.data.employee;
    this.form.controls._employee.setValue(this.employee._id);
    
    if (this.data.role === 'edit') {
      this.form = new FormGroup({
        _job: new FormControl(this.data.employeejob._job, Validators.required),
        _employee: new FormControl(this.data.employeejob._employee, Validators.required),
        initialSalary: new FormControl(this.data.employeejob.initialSalary, Validators.required),
        salaryPerHour: new FormControl(this.data.employeejob.salaryPerHour, Validators.required),
        monthlyHours: new FormControl(this.data.employeejob.monthlyHours, Validators.required),
        salaryExtraHours: new FormControl(this.data.employeejob.salaryExtraHours, Validators.required),
        lawBonus: new FormControl(this.data.employeejob.lawBonus, Validators.required),
        bonus: new FormControl(this.data.employeejob.bonus, Validators.required),
        startDate: new FormControl(this.data.employeejob.startDate, Validators.required),
        endDate: new FormControl(this.data.employeejob.endDate || null, Validators.required),
        contractType: new FormControl(this.data.employeejob.contractType, Validators.required),
        contract: new FormControl(this.data.employeejob.contract),
        paymentType: new FormControl(this.data.employeejob.paymentType, Validators.required),
        workPlace: new FormControl(this.data.employeejob.workPlace),
        workingDay: new FormControl(this.data.employeejob.workingDay || null),
      });
    }

    this.form.controls.contract.valueChanges.subscribe(data => { this.changed = true;});
  }




  addJob() {

    if (this.form.invalid) { return; }
    let employeejob: EmployeeJobItem;
    let FILE: FileInput;
    if (this.changed === true) {

      FILE = this.form.controls.contract.value;
      if (FILE) {
        this.form.controls.contract.setValue('archivo.temp');
      } else {
        this.form.controls.contract.setValue(null);
      }
    }


    if (this.data.role === 'new') {
      employeejob = {...this.form.value};
      this.employeeService.createEmployeeJobs(employeejob).subscribe(data => {
        if (this.changed === true) {

          if (FILE) {
            if (FILE.files) {
              this.uploadFileService.uploadFile(FILE.files[0], 'employeeJobs', data.employeeJob._id).then((resp: any) => {
                this.toasty.success('Puesto agregado exitósamente');
                this.dialogRef.close(true);
              }).catch(err => {
                  this.toasty.error('Falló subida de imagen');
                });
            }
          }
        } else {
          this.toasty.success('Puesto agregado exitósamente');
          this.dialogRef.close(true);
        }
          
      });
    } else {
      employeejob = {...this.form.value, _id: this.data.employee._id};
      this.employeeService.updateEmployeeJobs(employeejob).subscribe(data => {
        if (this.changed === true) {

          if (FILE) {
            if (FILE.files) {
              this.uploadFileService.uploadFile(FILE.files[0], 'employeeJobs', data.employeeJob._id).then((resp: any) => {
                this.toasty.success('Puesto modificado exitósamente');
                this.dialogRef.close(true);
              }).catch(err => {
                  this.toasty.error('Falló subida de imagen');
                });
            }
          }
        } else {
          this.toasty.success('Puesto modificado exitósamente');
          this.dialogRef.close(true);
        }
      });
    }
  }



  // uploadFile() {
  //   this.uploadFileService.uploadFile(FILE.files[0], 'configs', lastitem._id).then((resp: any) => {
  //     lastitem.img = resp.IMG;
  //     data.option.configs[data.option.configs.length - 1] = {...lastitem};
  //     this.dialogRef.close(data.option);
  //     this.loading = false;
  //   }).catch(err => {
  //     this.loading = false;
  //     this.toasty.error('Upload Failed');
  //   });
  // }

}
