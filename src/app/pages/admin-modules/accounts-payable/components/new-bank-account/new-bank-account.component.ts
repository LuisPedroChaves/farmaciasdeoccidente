import { Component, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CLOSE_DRAWER, CREATE_BANK_ACCOUNT } from 'src/app/store/actions';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { BankItem } from 'src/app/core/models/Bank';
import { BankService } from 'src/app/core/services/httpServices/bank.service';
import { BankStore } from 'src/app/store/reducers';

@Component({
  selector: 'app-new-bank-account',
  templateUrl: './new-bank-account.component.html',
  styleUrls: ['./new-bank-account.component.scss']
})
export class NewBankAccountComponent implements OnInit, OnDestroy, AfterContentInit {

  title: string;

  form = new FormGroup({
    _bank: new FormControl(null, Validators.required),
    no: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    balance: new FormControl(0, Validators.required),
    type: new FormControl('Monetaria', Validators.required),
  })

  drawerStoreSubscription = new Subscription;

  bankSubscription: Subscription;
  banks: BankItem[];

  constructor(
    private store: Store<BankStore>,
    private bankService: BankService,
    private toastyService: ToastyService
  ) { }

  ngOnInit(): void {

    this.drawerStoreSubscription = this.store.select('drawer')
      .subscribe(state => {
        this.title = state.drawerTitle;
      });

    this.bankSubscription = this.bankService.readData().subscribe((data) => {
      this.banks = data;
    });
  }

  ngAfterContentInit(): void {
    this.bankService.loadData();
  }

  ngOnDestroy(): void {
    this.drawerStoreSubscription?.unsubscribe();
    this.bankSubscription?.unsubscribe();
  }

  close() {
    this.store.dispatch(CLOSE_DRAWER());
  }

  save(): void {
    if (this.form.controls.balance.value < 0) {
      this.toastyService.error('Saldo incorrecto')
      return
    }

    this.store.dispatch(CREATE_BANK_ACCOUNT({ bankAccount: this.form.value }))

    this.toastyService.success('Cuenta creada exitosamente')

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
