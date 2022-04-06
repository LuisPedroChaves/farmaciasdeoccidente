import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

import { AccountsPayableBalanceItem, AccountsPayableItem } from 'src/app/core/models/AccountsPayable';
import { AccountsPayableService } from 'src/app/core/services/httpServices/accounts-payable.service';
import { ProviderService } from 'src/app/core/services/httpServices/provider.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';

@Component({
  selector: 'app-new-balance',
  templateUrl: './new-balance.component.html',
  styleUrls: ['./new-balance.component.scss']
})
export class NewBalanceComponent implements OnInit, OnChanges {

  @Input() amount = 0;
  @Input() accountsPayables: AccountsPayableItem[] = [];
  @Output() close = new EventEmitter;

  loading = false;
  progress = 0;

  form = new FormGroup({
    date: new FormControl('', Validators.required),
    document: new FormControl('', Validators.required),
    credit: new FormControl('DEPOSITO', Validators.required),
    amount: new FormControl({
      value: '',
      disabled: true
    }, Validators.required),
  });

  constructor(
    private toastyService: ToastyService,
    private accountsPayableService: AccountsPayableService,
    private providerService: ProviderService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.amount) {
      this.form.controls.amount.setValue(changes.amount.currentValue);
    }
  }

  async save(): Promise<void> {
    if (this.form.controls.amount.value <= 0) {
      this.toastyService.error('Monto incorrecto')
      return
    }
    const BALANCE: AccountsPayableBalanceItem = {
      date: this.form.controls.date.value,
      document: this.form.controls.document.value,
      credit: this.form.controls.credit.value,
      amount: this.amount,
    }

    this.loading = true;
    await this.updateAccountsPayable(0, BALANCE);
    this.toastyService.success('Pago creado exitosamente')
    this.accountsPayableService.loadData();
    this.close.emit(BALANCE.amount)
    this.form.reset({
      date: '',
      document: '',
      credit: 'DEPOSITO',
      amount: '',
    })
    this.loading = false;
  }

  updateAccountsPayable(index: number, balance: AccountsPayableBalanceItem): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const ACCOUNTS_PAYABLE = this.accountsPayables.find((c, i) => i === index);
      if (ACCOUNTS_PAYABLE) {
        this.progress = (index * 100) / this.accountsPayables.length;

        // Actualizando campos de cuenta por pagar
        balance.amount = (+ACCOUNTS_PAYABLE.total - +ACCOUNTS_PAYABLE.balance.reduce((sum, item) => {
          if (item.credit === 'RETENCION_IVA' || item.credit === 'RETENCION_ISR') {
            sum += item.amount
          } else {
            sum += 0;
          }
          return sum;
        }, 0));
        ACCOUNTS_PAYABLE.balance.push(balance);
        ACCOUNTS_PAYABLE.paid = true;

        this.accountsPayableService
          .update(ACCOUNTS_PAYABLE)
          .pipe(
            switchMap(({ resp }) => this.providerService.updateBalance({
              _provider: ACCOUNTS_PAYABLE._provider._id,
              amount: balance.amount,
              action: 'RESTA'
            }))
          )
          .subscribe(async (resp) => {
            index++;
            await this.updateAccountsPayable(index, balance);
            resolve();
          })
      } else {
        resolve();
      }
    });
  }

}
