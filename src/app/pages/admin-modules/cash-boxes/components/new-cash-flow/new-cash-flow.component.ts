import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { CashItem } from 'src/app/core/models/Cash';
import { CashFlowService } from 'src/app/core/services/httpServices/cash-flow.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { CREATE_CASH_FLOW } from 'src/app/store/actions/accountingCash.actions';
import { AppAccountingCash } from 'src/app/store/reducers/accountingCash.reducer';

@Component({
  selector: 'app-new-cash-flow',
  templateUrl: './new-cash-flow.component.html',
  styleUrls: ['./new-cash-flow.component.scss']
})
export class NewCashFlowComponent implements OnInit {

  @Input() cash: CashItem;
  @Input() typeNew: string;
  @Output() close = new EventEmitter;
  @Output() sendBalance = new EventEmitter;

  loading = false;

  form = new FormGroup({
    _cash: new FormControl(null),
    details: new FormControl('', Validators.required),
    income: new FormControl(0, Validators.required),
    expense: new FormControl(0, Validators.required),
  });

  formAccounting = new FormGroup({
    _cash: new FormControl(null),
    date: new FormControl('', Validators.required),
    serie: new FormControl(''),
    noBill: new FormControl('', Validators.required),
    details: new FormControl('', Validators.required),
    income: new FormControl(0, Validators.required),
    expense: new FormControl(0, Validators.required),
    state: new FormControl('PENDIENTE', Validators.required),
  });

  constructor(
    private cashFlowService: CashFlowService,
    private toastyService: ToastyService,
    private store: Store<AppAccountingCash>,
  ) { }

  ngOnInit(): void {
  }

  save(): void {

    this.loading = true;
    this.form.controls['_cash'].setValue(this.cash);

    this.cashFlowService.create({
      ...this.form.value,
    })
      .subscribe(cashFlow => {
        this.toastyService.success('Movimiento creado exitosamente')
        this.cashFlowService.loadData(this.cash._id);
        // this.close.emit()
        this.form.reset({
          _cash: null,
          details: '',
          income: 0,
          expense: 0,
        })
        this.sendBalance.emit(cashFlow.balance)
        this.loading = false;
      })
  }

  saveAccounting(): void {

    this.formAccounting.controls['_cash'].setValue(this.cash);

    this.store.dispatch(CREATE_CASH_FLOW({ cashFlow: this.formAccounting.value }))

    this.cashFlowService.loadData(this.cash._id);
    this.formAccounting.reset({
      _cash: null,
      date: '',
      serie: '',
      noBill: '',
      details: '',
      income: 0,
      expense: 0,
    })
  }

}
