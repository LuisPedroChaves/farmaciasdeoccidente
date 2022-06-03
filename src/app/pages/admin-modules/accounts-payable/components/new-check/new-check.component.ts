import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

import { BankAccountItem } from 'src/app/core/models/Bank';
import { BankStore } from 'src/app/store/reducers/bank.reducer';
import { CheckService } from '../../../../../core/services/httpServices/check.service';
import { AccountsPayableItem } from '../../../../../core/models/AccountsPayable';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { CheckItem } from '../../../../../core/models/Check';
import { AccountsPayableService } from '../../../../../core/services/httpServices/accounts-payable.service';

@Component({
  selector: 'app-new-check',
  templateUrl: './new-check.component.html',
  styleUrls: ['./new-check.component.scss']
})
export class NewCheckComponent implements OnInit, OnChanges, OnDestroy {

  @Input() name = '';
  @Input() amount = 0;
  @Input() accountsPayables: AccountsPayableItem[] = [];
  @Output() close = new EventEmitter;

  loading = false;

  form = new FormGroup({
    _bankAccount: new FormControl(null, Validators.required),
    no: new FormControl('', Validators.required),
    city: new FormControl('Huehuetenango', Validators.required),
    date: new FormControl(moment(), Validators.required),
    name: new FormControl({
      value: '',
      disabled: true
    }, Validators.required),
    amount: new FormControl({
      value: '',
      disabled: true
    }, Validators.required),
    note: new FormControl(''),
    bank: new FormControl('INTERBANCO', Validators.required),
    state: new FormControl('CREADO', Validators.required),
  });

  bankStoreSubscription: Subscription;
  bankAccounts: BankAccountItem[] = [];

  constructor(
    private store: Store<BankStore>,
    private checkService: CheckService,
    private toastyService: ToastyService,
    private accountsPayableService: AccountsPayableService
  ) { }

  ngOnInit(): void {
    this.bankStoreSubscription = this.store.select('Bank')
      .subscribe(state => {
        this.bankAccounts = state.bankAccounts
      });
  }

  ngOnDestroy(): void {
      this.bankStoreSubscription?.unsubscribe()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.name) {
      this.form.controls.name.setValue(changes.name.currentValue);
    }
    if (changes.amount) {
      this.form.controls.amount.setValue(changes.amount.currentValue);
    }
  }

  save(): void {
    if (this.form.controls.amount.value <= 0) {
      this.toastyService.error('Monto incorrecto')
      return
    }
    const CHECK: CheckItem = {
      _bankAccount: this.form.controls._bankAccount.value,
      no: this.form.controls.no.value,
      city: this.form.controls.city.value,
      date: this.form.controls.date.value,
      name: this.name,
      amount: this.amount,
      accountsPayables: this.accountsPayables,
      note: this.form.controls.note.value,
      bank: this.form.controls.bank.value,
      state: this.form.controls.state.value,
    }
    this.loading = true;
    this.checkService.create(CHECK)
      .subscribe(resp => {
        this.toastyService.success('Cheque creado exitosamente')
        this.accountsPayableService.loadData();
        this.close.emit()
        this.form.reset({
          no: '',
          city: '',
          date: '',
          name: '',
          amount: '',
          note: '',
          bank: 'INTERBANCO',
          state: 'CREADO'
        })
        this.loading = false;
      })

  }

}
