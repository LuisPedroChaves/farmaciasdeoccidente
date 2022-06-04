import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { BankFlowService } from 'src/app/core/services/httpServices/bank-flow.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { CLOSE_DRAWER, SET_BANK_ACCOUNT_BALANCE } from 'src/app/store/actions';
import { BankStore } from 'src/app/store/reducers';

@Component({
  selector: 'app-new-bank-flow',
  templateUrl: './new-bank-flow.component.html',
  styleUrls: ['./new-bank-flow.component.scss']
})
export class NewBankFlowComponent implements OnInit, OnDestroy {

  title: string;

  form = new FormGroup({
    _bankAccount: new FormControl(null, Validators.required),
    _check: new FormControl(null),
    date: new FormControl(null),
    document: new FormControl('', Validators.required),
    details: new FormControl('', Validators.required),
    credit: new FormControl(0, Validators.required),
    debit: new FormControl(0, Validators.required),
    balance: new FormControl(0, Validators.required),
    type: new FormControl('Deposito', Validators.required),
  })

  drawerStoreSubscription = new Subscription;

  bankStoreSubscription = new Subscription;
  currentBalance = 0;

  constructor(
    private store: Store<BankStore>,
    private bankFlowService: BankFlowService,
    private toastyService: ToastyService
  ) { }

  ngOnInit(): void {
    this.drawerStoreSubscription = this.store.select('drawer')
      .subscribe(state => {
        this.title = state.drawerTitle;
      });

    this.bankStoreSubscription = this.store.select('bank')
      .subscribe(state => {
        this.form.controls['_bankAccount'].setValue(state.bankAccount._id);
        this.currentBalance = state.bankAccount.balance;
      })
  }

  ngOnDestroy(): void {
    this.drawerStoreSubscription?.unsubscribe();
    this.bankStoreSubscription?.unsubscribe();
  }

  close() {
    this.store.dispatch(CLOSE_DRAWER());
  }

  save(): void {

    this.bankFlowService.create({ ...this.form.value })
      .subscribe(resp => {

        this.toastyService.success('Movimiento creado exitosamente')

        this.store.dispatch(SET_BANK_ACCOUNT_BALANCE({
          idBankAccount: this.form.controls['_bankAccount'].value,
          amount: this.currentBalance + this.form.controls['credit'].value
        }))

        const FILTER = {
          idBankAccount: this.form.controls['_bankAccount'].value,
          startDate: moment(),
          endDate: moment()
        }
        this.bankFlowService.loadData(FILTER);

        this.form.reset({
          _bankAccount: null,
          _check: null,
          date: null,
          document: '',
          details: '',
          credit: 0,
          debit: 0,
          balance: 0,
          type: 'Deposito',
        })

      })

  }

}
