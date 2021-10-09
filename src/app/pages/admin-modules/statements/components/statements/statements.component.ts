import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { PaySaleComponent } from 'src/app/pages/modules/sales/components/pay-sale/pay-sale.component';
import { CustomerService } from '../../../../../core/services/httpServices/customer.service';
import { SaleService } from '../../../../../core/services/httpServices/sale.service';
import { SaleItem } from '../../../../../core/models/Sale';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-statements',
  templateUrl: './statements.component.html',
  styleUrls: ['./statements.component.scss']
})
export class StatementsComponent implements OnInit {

  smallScreen = window.innerWidth < 960 ? true : false;

  selectedCustomer: any;
  sales: SaleItem[];
  return = '';
  loading = false;

  //totals
  total = 0;
  timeInvaliable = 0;

  range = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date())
  });

  avatars = [
    { index: 0, image: 'assets/images/avatars/01.png' },
    { index: 1, image: 'assets/images/avatars/02.png' },
    { index: 2, image: 'assets/images/avatars/03.png' },
    { index: 3, image: 'assets/images/avatars/04.png' },
    { index: 4, image: 'assets/images/avatars/05.png' },
    { index: 5, image: 'assets/images/avatars/00M.jpg' },
    { index: 6, image: 'assets/images/avatars/00F.jpg' },
  ];

  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public toasty: ToastyService,
    public dialog: MatDialog,
    public customerService: CustomerService,
    public saleService: SaleService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.loadCustomer(params.id);
      this.return = params.return;
    });
    this.range.valueChanges
    .pipe(
      debounceTime(500),
    )
    .subscribe(range => {
      if (range.start && range.end) {
        this.loadData(range.start, range.end);
      }
    });
  }

  loadCustomer(id) {
    this.customerService.getStatements(id).subscribe(data => {
      this.selectedCustomer = data.customer;
      this.getTotals();
      this.loadData(this.range.get('start').value, this.range.get('end').value);
    });
  }

  loadData(start, end) {
    this.loading = true;
    const startDate = start._d ? start._d : start;
    const endDate = end._d ? end._d : end;
    this.saleService.getHistory(this.selectedCustomer._id, startDate, endDate).subscribe(data => {
      this.sales = data.sales;
      this.loading = false;
    });
    const FILTER = {
      startDate,
      endDate
    };
  }

  getTotals() {
    this.total = 0;
    this.timeInvaliable = 0;
    this.selectedCustomer.recivables = this.selectedCustomer.recivables.map((sale: any) => {
      const paid = sale.balance.reduce((sum, item) => parseFloat(sum) + parseFloat(item.amount),
      0);
      this.total = this.total + parseFloat(sale.total) - parseFloat(paid);
      sale.timeAvaliable = true;
      const date1 = new Date(sale.date);
      const date2 = new Date();
      const days = Math.floor((date2.getTime() - date1.getTime()) / 86400000).toFixed(0);
      if (parseInt(days) > this.selectedCustomer.limitDaysCredit) {
        this.timeInvaliable++;
        sale.timeAvaliable = false;
      }
      return {
        ...sale
      }
    });
  }

  pay(sale: SaleItem) {
    const dialogRef = this.dialog.open(PaySaleComponent, {
      width: '500px',
      minHeight: '85vh',
      maxHeight: '78vh',
      disableClose: true,
      data: { sale },
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.customerService.getStatements(this.selectedCustomer._id).subscribe(data => {
          this.selectedCustomer = data.customer;
          this.getTotals();
          this.loadData(this.range.get('start').value, this.range.get('end').value);
        });
      }
    });
  }
}
