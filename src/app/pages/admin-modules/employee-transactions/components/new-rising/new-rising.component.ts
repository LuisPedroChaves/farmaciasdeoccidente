import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeItem } from 'src/app/core/models/Employee';
import { EmployeeJobItem } from 'src/app/core/models/EmployeeJob';
import { RisingItem } from 'src/app/core/models/Risings';
import { EmployeeService } from 'src/app/core/services/httpServices/employee.service';
import { RisingsService } from 'src/app/core/services/httpServices/risings.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { ConfirmationComponent } from 'src/app/pages/shared-components/confirmation/confirmation.component';

@Component({
  selector: 'app-new-rising',
  templateUrl: './new-rising.component.html',
  styleUrls: ['./new-rising.component.scss']
})
export class NewRisingComponent implements OnInit {

  form = new FormGroup({
    _employeeJob: new FormControl({value: null, disabled: true}, Validators.required),
    date: new FormControl(new Date(), Validators.required),
    type: new FormControl(null, Validators.required),
    details: new FormControl(null, Validators.required),
    hours: new FormControl(null, Validators.required),
    amount: new FormControl(null, Validators.required),
    approved: new FormControl(false, Validators.required),
    applied: new FormControl(false, Validators.required),
  });

  employee: string;
  employees: EmployeeItem[] = [];
  employeJobs: EmployeeJobItem[] = [];
  constructor(public dialogRef: MatDialogRef<NewRisingComponent>, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, public toasty: ToastyService, public risingsService: RisingsService, public employeeService: EmployeeService) { }

  
  ngOnInit(): void {
    this.employees = this.data.employees;
    this.form.controls.type.setValue(this.data.type);
    if (this.data.role === 'edit') {
      this.employee = this.data.rising._employeeJob._employee._id;
      this.changeEmployeeProm().then(data => {
        this.employeJobs = data.employeeJobs;
        this.form.controls._employeeJob.enable();
        this.form = new FormGroup({
            _employeeJob: new FormControl(this.data.rising._employeeJob._id, Validators.required),
            date: new FormControl(this.data.rising.date, Validators.required),
            type: new FormControl(this.data.rising.type, Validators.required),
            details: new FormControl(this.data.rising.details, Validators.required),
            hours: new FormControl(this.data.rising.hours, Validators.required),
            amount: new FormControl(this.data.rising.amount, Validators.required),
            approved: new FormControl(this.data.rising.approved, Validators.required),
            applied: new FormControl(this.data.rising.applied, Validators.required),
        });
      })
    }
  }




  changeEmployee() {
    this.form.controls._employeeJob.disable();
    this.employeeService.getEmployeeJobs(this.employee).subscribe(data => {
      this.employeJobs = data.employeeJobs;
      this.form.controls._employeeJob.enable();
    });
  }
  changeEmployeeProm(): Promise<any> {
    this.form.controls._employeeJob.disable();
    return this.employeeService.getEmployeeJobs(this.employee).toPromise();
  }


  add() {

    if (this.form.invalid) { this.toasty.error('Faltan campos por llenar'); return; }

    const discount: RisingItem = {...this.form.value };
    if (this.data.role === 'new') {
      this.risingsService.create(discount).subscribe(data => {
        this.toasty.success(this.data.success);
        this.dialogRef.close(true);
      });
    } else {
      this.risingsService.update({...discount, _id: this.data.rising._id}).subscribe(data => {
        this.toasty.success(this.data.success);
        this.dialogRef.close(true);
      });

    }
  }


  delete() {
    const dialog = this.dialog.open(ConfirmationComponent, {
      width: '350px',
      data: { title: 'Eliminar Registro', msg: '¿Confirma que desea eliminar este registro?' },
      panelClass: ['farmacia-dialog', 'farmacia']
    });

    dialog.afterClosed().subscribe(data => {
      if (data === true) {
        this.risingsService.delete(this.data.rising).subscribe(datas => {
          this.toasty.success('Registro eliminado exitósamente');
          this.dialogRef.close(true);
        });
      }
    });
  }

}
