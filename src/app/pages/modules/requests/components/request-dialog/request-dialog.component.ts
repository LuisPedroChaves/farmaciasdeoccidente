import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DiscountItem, TransactionItem } from 'src/app/core/models/Discounts';
import { EmployeeJobItem } from 'src/app/core/models/EmployeeJob';
import { RisingItem } from 'src/app/core/models/Risings';
import { DiscountsService } from 'src/app/core/services/httpServices/discounts.service';
import { RisingsService } from 'src/app/core/services/httpServices/risings.service';

@Component({
  selector: 'app-request-dialog',
  templateUrl: './request-dialog.component.html',
  styleUrls: ['./request-dialog.component.scss']
})
export class RequestDialogComponent implements OnInit {
  employeeJobs: EmployeeJobItem[] = [];
  risingsTypes = ['horasExtra'];
  discountsTypes = ['permiso', 'diadescanso', 'citaIGSS'];
  form = new FormGroup({
    _employeeJob: new FormControl({value: null}, Validators.required),
    date: new FormControl(new Date(), Validators.required),
    type: new FormControl(null, Validators.required),
    hours: new FormControl(null, Validators.required),
    amount: new FormControl(null, Validators.required),
    approved: new FormControl(false, Validators.required),
    hasDiscount: new FormControl(false, Validators.required),
    applied: new FormControl(false, Validators.required),
    details: new FormControl(null),
  });
  constructor(public dialogRef: MatDialogRef<RequestDialogComponent>, public risingsService: RisingsService,  public discountService: DiscountsService, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.employeeJobs =  this.data.employeeJobs;
    this.form.controls.type.setValue(this.data.type);
    if (this.data.type === 'horasExtra') {
      this.form.controls.details.setValue('Ingreso de horas extras');

    }
  }



  save() {
    

    const request: TransactionItem = {...this.form.value};
    if (this.risingsTypes.includes(this.data.type)) {
      const rising: RisingItem = this.parseRequestRising(request);
      this.risingsService.create(rising).subscribe(data => {
        this.dialogRef.close(true);
      });
    } else {
      const discount: DiscountItem = this.parseRequestDiscount(request);
      this.discountService.create(discount).subscribe(data => {
        this.dialogRef.close(true);
      });

    }
  }

  saveEdit() {
    this.dialogRef.close(true);
  }



  parseRequestRising(r: TransactionItem):RisingItem {
    const rising: RisingItem = {
      _employeeJob: r._employeeJob,
      date: r.date,
      type: r.type,
      details: r.details,
      hours: r.hours,
      amount: r.amount,
      approved: false,
      applied: r.applied,
    };

    return rising;
  }

  parseRequestDiscount(r: TransactionItem):DiscountItem {
    const discount: DiscountItem = {
      _employeeJob: (r._employeeJob as any),
      date: r.date,
      type: r.type,
      hours: r.hours,
      details: r.details,
      amount: r.amount,
      approved: r.approved,
      hasDiscount: r.hasDiscount,
      applied: false,
    };

    return discount;
  }
}
