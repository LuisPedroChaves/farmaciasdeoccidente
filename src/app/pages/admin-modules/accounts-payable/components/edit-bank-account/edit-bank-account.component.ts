import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { CLOSE_DRAWER, UPDATE_BANK_ACCOUNT } from 'src/app/store/actions';
import { BankStore } from 'src/app/store/reducers';

@Component({
  selector: 'app-edit-bank-account',
  templateUrl: './edit-bank-account.component.html',
  styleUrls: ['./edit-bank-account.component.scss']
})
export class EditBankAccountComponent implements OnInit, OnDestroy {

  title: string;

  form = new FormGroup({
    _id: new FormControl(null, Validators.required),
    _bank: new FormControl(null, Validators.required),
    no: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    balance: new FormControl(0, Validators.required),
    type: new FormControl('Monetaria', Validators.required),
  })

  drawerStoreSubscription = new Subscription;
  bankStoreSubscription = new Subscription;

  constructor(
    private store: Store<BankStore>,
    private toastyService: ToastyService
  ) { }

  ngOnInit(): void {
    this.drawerStoreSubscription = this.store.select('drawer')
      .subscribe(state => {
        this.title = state.drawerTitle;
      });

    this.bankStoreSubscription = this.store.select('bank')
      .subscribe(state => {
        this.form.controls['_id'].setValue(state.bankAccount._id);
        this.form.controls['_bank'].setValue(state.bankAccount._bank);
        this.form.controls['no'].setValue(state.bankAccount.no);
        this.form.controls['name'].setValue(state.bankAccount.name);
        this.form.controls['balance'].setValue(state.bankAccount.balance);
        this.form.controls['type'].setValue(state.bankAccount.type);
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

    this.store.dispatch(UPDATE_BANK_ACCOUNT({ bankAccount: this.form.value }))

    this.toastyService.success('Cuenta editada exitosamente')

    this.form.reset({
      _bank: null,
      no: '',
      name: '',
      balance: '',
      type: 'Monetaria'
    })

    this.close();
  }

}
