import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderItem } from '../../../../../core/models/Order';
import { OrderService } from '../../../../../core/services/httpServices/order.service';

@Component({
  selector: 'app-select-order',
  templateUrl: './select-order.component.html',
  styleUrls: ['./select-order.component.scss']
})
export class SelectOrderComponent implements OnInit {

  smallScreen = window.innerWidth < 960 ? true : false;

  selectedOrder: OrderItem;
  return = 'orders';

  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public toasty: ToastyService,
    public dialog: MatDialog,
    public orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( (params) => {
      this.orderService.getOrder(params.id).subscribe(data => {
        this.selectedOrder  = data.order;
      });
      this.return = params.return;
    });
  }

  getDifferenceInMinutes(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60);
  }

  // addJob() {
  //   const dialogRef = this.dialog.open(AssignJobComponent, {
  //     width: this.smallScreen === true ? '100%' : '500px',
  //     data: { jobs: this.jobs, campus: this.campus, degree: this.form.controls._degree.value },
  //     panelClass: ['farmacia-dialog', 'farmacia' ],
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result !== undefined) {
  //       this.employeejobs.push(result);
  //     }
  //   });
  // }


  // removeJob(index) {
  //   this.employeejobs.splice(index, 1);
  // }


  private markFormGroupTouched(formGroup: FormGroup): void {
    (Object as any).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // addDegree() {
  //   const dialogRef = this.dialog.open(AddDegreeComponent, {
  //     width: this.smallScreen ? '100%' : '350px',
  //     data: { },
  //     disableClose: true,
  //     panelClass: ['farmacia-dialog' , 'farmacia'],
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result !== undefined) {
  //       if (result === true) {

  //         this.employeeService.getDegrees().subscribe(data => {
  //           this.degrees = data.degrees;
  //         });
  //       }
  //     }
  //   });
  // }

}
