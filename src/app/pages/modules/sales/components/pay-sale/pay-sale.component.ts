import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SaleBalanceItem } from '../../../../../core/models/Sale';
import { SaleService } from '../../../../../core/services/httpServices/sale.service';

@Component({
  selector: 'app-pay-sale',
  templateUrl: './pay-sale.component.html',
  styleUrls: ['./pay-sale.component.scss']
})
export class PaySaleComponent implements OnInit {

  newPay: SaleBalanceItem = { _id: '', date: '', receipt: '', document: '', payment: 'EFECTIVO', amount: null };
  error = false;

  constructor(
    public dialogRef: MatDialogRef<PaySaleComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public saleService: SaleService
  ) { }

  ngOnInit(): void {
  }

  getTotalBalance() {
    let total = 0;
    this.data.sale.balance.forEach(fee => {
      total += +fee.amount;
    });
    return total;
  }

  addPay() {
    this.error = false;
    delete this.newPay._id;
    if ((this.newPay.amount > (+this.data.sale.total - +this.getTotalBalance())) || (+this.newPay.amount === 0)) {
      this.error = true;
    } else {
      this.data.sale.balance.push(this.newPay);
      this.newPay = { _id: '', date: '', receipt: '', document: '', payment: 'EFECTIVO', amount: null };
      this.saleService.updateSale(this.data.sale).subscribe(data => {
        if (data.ok === true) {
          this.data.sale.balance = data.sale.balance;
          this.data.sale.paid = data.sale.paid;
        }
      });
    }
  }

  remove(b) {
    const index = this.data.sale.balance.findIndex(ba => ba._id === b._id);
    if (index > -1) {
      this.data.sale.balance.splice(index, 1);
    }
    this.saleService.updateSale(this.data.sale).subscribe(data => {
      if (data.ok === true) {
        this.data.sale.balance = data.sale.balance;
        this.data.sale.paid = data.sale.paid;
      }
    });
  }

}
