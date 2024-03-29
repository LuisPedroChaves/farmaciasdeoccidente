import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from 'src/app/store/app.reducer';
import { SaleBalanceItem } from '../../../../../core/models/Sale';
import { SaleService } from '../../../../../core/services/httpServices/sale.service';
import { UploadFileService } from '../../../../../core/services/httpServices/upload-file.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';

@Component({
  selector: 'app-pay-sale',
  templateUrl: './pay-sale.component.html',
  styleUrls: ['./pay-sale.component.scss']
})
export class PaySaleComponent implements OnInit {

  smallScreen = window.innerWidth < 960 ? true : false;

  newPay: SaleBalanceItem = { _id: '', date: new Date(), receipt: '', document: '', payment: 'EFECTIVO', amount: null };
  error = false;

  sessionsubscription: Subscription;
  currentUser: any;

  constructor(
    public dialogRef: MatDialogRef<PaySaleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public store: Store<AppState>,
    public saleService: SaleService,
    public uploadFileService: UploadFileService,
    public toasty: ToastyService
  ) { }

  ngOnInit(): void {
    this.sessionsubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      this.currentUser = session.currentUser;
    });
  }

  upload(file: File, balance: any) {
    if (!file) {
      return;
    }

    this.uploadFileService.uploadFile(file, 'saleBalances', balance._id)
      .then((resp: any) => {
        this.toasty.success('Archivo guardado exitosamente');
        balance.file = resp.newNameFile;
      })
      .catch(err => {
        this.toasty.error('Error al cargar el archivo');
      });
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
    console.log(this.newPay.amount);
console.log(+(+this.data.sale.total - +this.getTotalBalance()).toFixed(2));


    if ((this.newPay.amount > +(+this.data.sale.total - +this.getTotalBalance()).toFixed(2)) || (+this.newPay.amount === 0)) {
      this.error = true;
    } else {
      this.data.sale.balance.push(this.newPay);
      this.newPay = { _id: '', date: new Date(), receipt: '', document: '', payment: 'EFECTIVO', amount: null };
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
