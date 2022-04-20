import { Component, Input, OnInit, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs/operators';

import { AccountsPayableBalanceItem, AccountsPayableItem } from 'src/app/core/models/AccountsPayable';
import { AccountsPayableService } from 'src/app/core/services/httpServices/accounts-payable.service';
import { ProviderService } from 'src/app/core/services/httpServices/provider.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';

@Component({
  selector: 'app-accounts-payable',
  templateUrl: './accounts-payable.component.html',
  styleUrls: ['./accounts-payable.component.scss']
})
export class AccountsPayableComponent implements OnInit, OnChanges {

  @Input()
  accountsPayable: AccountsPayableItem;
  @Output()
  return = new EventEmitter();
  @Output()
  sendAmount = new EventEmitter();
  @Output()
  sendEdit = new EventEmitter();

  form = new FormGroup({
    date: new FormControl('', Validators.required),
    document: new FormControl('', Validators.required),
    credit: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
  });
  loading = false;

  displayedColumns: string[] = ['check', 'date', 'document', 'credit', 'amount'];
  dataSource = new MatTableDataSource([]);

  constructor(
    private accountsPayableService: AccountsPayableService,
    private toastyService: ToastyService,
    private providerService: ProviderService,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.accountsPayable) {
      this.dataSource = new MatTableDataSource<AccountsPayableBalanceItem>(changes.accountsPayable.currentValue.balance);
    }
  }

  expired(expirationCredit: Date): boolean {
    return new Date(expirationCredit) < new Date();
  }

  getTotalAfecto(): number {
    return +this.accountsPayable.netPurchaseAmount +
      +this.accountsPayable.netServiceAmount +
      +this.accountsPayable.iva;
  }

  enter() {
    this.loading = true;
    /* #region  Validaciones */
    if (this.form.controls.credit.value === 'RETENCION_IVA') {
      this.accountsPayable.emptyWithholdingIVA = false;
    }
    if (this.form.controls.credit.value === 'RETENCION_ISR') {
      this.accountsPayable.emptyWithholdingISR = false;
    }
    /* #endregion */
    const AMOUNT = this.form.controls.amount.value;

    this.accountsPayable.balance.push({ ...this.form.value })
    this.accountsPayableService.update(this.accountsPayable)
      .pipe(
        switchMap(({ resp }) => this.providerService.updateBalance({
          _provider: this.accountsPayable._provider._id,
          amount: AMOUNT,
          action: 'RESTA'
        }))
      )
      .subscribe(resp => {
        this.toastyService.success('Retención ingresada exitosamente');
        this.dataSource = new MatTableDataSource<AccountsPayableBalanceItem>(this.accountsPayable.balance);
        this.accountsPayableService.loadData();
        this.form.reset({
          credit: ''
        });
        this.sendAmount.emit(AMOUNT);
        this.loading = false;
      })
  }

}
