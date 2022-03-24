import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import * as moment from 'moment';

import { CheckService } from '../../../../../core/services/httpServices/check.service';
import { AccountsPayableItem } from '../../../../../core/models/AccountsPayable';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { CheckItem } from '../../../../../core/models/Check';
import { PrintService } from '../../../../../core/services/internal/print.service';
import { NumberToWordsPipe } from '../../../../../core/shared/pipes/formatPipes/number-to-words.pipe';
import { AccountsPayableService } from '../../../../../core/services/httpServices/accounts-payable.service';

@Component({
  selector: 'app-new-check',
  templateUrl: './new-check.component.html',
  styleUrls: ['./new-check.component.scss']
})
export class NewCheckComponent implements OnInit, OnChanges {

  @Input() name = '';
  @Input() amount = 0;
  @Input() accountsPayables: AccountsPayableItem[] = [];
  @Output() close = new EventEmitter;

  loading = false;

  form = new FormGroup({
    no: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    name: new FormControl({
      value: '',
      disabled: true
    }, Validators.required),
    amount: new FormControl({
      value: '',
      disabled: true
    }, Validators.required),
    note: new FormControl(''),
    state: new FormControl('CREADO', Validators.required),
  });

  constructor(
    private checkService: CheckService,
    private toastyService: ToastyService,
    private printService: PrintService,
    private numberToWords: NumberToWordsPipe,
    private accountsPayableService: AccountsPayableService
  ) { }

  ngOnInit(): void {
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
      no: this.form.controls.no.value,
      city: this.form.controls.city.value,
      date: this.form.controls.date.value,
      name: this.name,
      amount: this.amount,
      accountsPayables: this.accountsPayables,
      note: this.form.controls.note.value,
      state: this.form.controls.state.value,
    }
    this.loading = true;
    this.checkService.create(CHECK)
      .subscribe(resp => {
        this.toastyService.success('Cheque creado exitosamente')
        this.accountsPayableService.loadData();
        this.print(resp.check)
        this.close.emit()
        this.form.reset({
          no: '',
          city: '',
          date: '',
          name: '',
          amount: '',
          note: '',
          state: 'CREADO'
        })
        this.loading = false;
      })

  }

  print(check: CheckItem) {
    const body = [];

    body.push({ text: '\n' });
    body.push(
      {
        layout: 'noBorders',
        table: {
          widths: ['50%', '10%'],
          headerRows: 1,
          body: [
            [{ text: `${check.city}, ${moment(check.date).format('DD [de] MMMM [de] YYYY')}`, style: 'text9' }, { text: check.amount.toFixed(2), style: 'text9' }],
            [{ text: check.name, style: 'text9', colSpan: 2 }],
            [{ text: this.numberToWords.transform(check.amount), style: 'text9', colSpan: 2 }],
          ]
        }
      });

    this.printService.print(body);
  }

}