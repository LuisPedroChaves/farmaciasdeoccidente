import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DiscountItem } from 'src/app/core/models/Discounts';
import { EmployeeItem } from 'src/app/core/models/Employee';
import { EmployeeJobItem } from 'src/app/core/models/EmployeeJob';
import { DiscountsService } from 'src/app/core/services/httpServices/discounts.service';
import { EmployeeService } from 'src/app/core/services/httpServices/employee.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { ConfirmationComponent } from 'src/app/pages/shared-components/confirmation/confirmation.component';

@Component({
  selector: 'app-new-discount',
  templateUrl: './new-discount.component.html',
  styleUrls: ['./new-discount.component.scss']
})
export class NewDiscountComponent implements OnInit {

  form = new FormGroup({
    _employeeJob: new FormControl({value: null, disabled: true}, Validators.required),
    date: new FormControl(new Date(), Validators.required),
    type: new FormControl(null, Validators.required),
    hours: new FormControl(null),
    amount: new FormControl(null),
    approved: new FormControl(false, Validators.required),
    hasDiscount: new FormControl(false, Validators.required),
    applied: new FormControl(false, Validators.required),
    details: new FormControl(null),
  });

  employee: string;
  employees: EmployeeItem[] = [];
  employeJobs: EmployeeJobItem[] = [];
  constructor(public dialogRef: MatDialogRef<NewDiscountComponent>, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, public toasty: ToastyService, public discountsService: DiscountsService, public employeeService: EmployeeService) { }


  ngOnInit(): void {
    this.employees = this.data.employees;
    this.form.controls.type.setValue(this.data.type);
    
    if (this.data.role === 'edit') {
      this.employee = this.data.discount._employeeJob._employee._id;
      this.changeEmployeeProm().then(data => {
        this.employeJobs = data.employeeJobs;
        this.form.controls._employeeJob.enable();
        this.form = new FormGroup({
          date: new FormControl(this.data.discount.date, Validators.required),
          _employeeJob: new FormControl(this.data.discount._employeeJob._id, Validators.required),
          type: new FormControl(this.data.discount.type, Validators.required),
          hours: new FormControl(this.data.discount.hours),
          amount: new FormControl(this.data.discount.amount),
          approved: new FormControl(this.data.discount.approved, Validators.required),
          hasDiscount: new FormControl(this.data.discount.hasDiscount, Validators.required),
          applied: new FormControl(this.data.discount.applied, Validators.required),
          details: new FormControl(this.data.discount.details),
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

    const discount: DiscountItem = {...this.form.value };
    if (this.data.role === 'new') {
      this.discountsService.create(discount).subscribe(data => {
        this.toasty.success(this.data.success);
        this.dialogRef.close(true);
      });
    } else {
      this.discountsService.update({...discount, _id: this.data.discount._id}).subscribe(data => {
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
        this.discountsService.delete(this.data.discount).subscribe(datas => {
          this.toasty.success('Registro eliminado exitósamente');
          this.dialogRef.close(true);
        });
      }
    });
  }

}
