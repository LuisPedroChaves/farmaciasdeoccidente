import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { CashService } from '../../../../../core/services/httpServices/cash.service';
import { CashItem } from '../../../../../core/models/Cash';
import { UserItem } from 'src/app/core/models/User';

@Component({
  selector: 'app-new-cash',
  templateUrl: './new-cash.component.html',
  styleUrls: ['./new-cash.component.scss']
})
export class NewCashComponent implements OnInit {

  @Input() cashes: CashItem[] = [];
  @Output() close = new EventEmitter;

  loading = false;

  form = new FormGroup({
    _user: new FormControl(null),
    type: new FormControl('INDEPENDIENTE', Validators.required),
    balance: new FormControl(0, Validators.required),
  });

  selectedUser: UserItem;

  constructor(
    private cashService: CashService,
    private toastyService: ToastyService,
  ) { }

  ngOnInit(): void {
  }

  getUser(user: UserItem): void {
    this.selectedUser = user;
  }

  save(): void {
    if (!this.selectedUser) {
      this.toastyService.error('Usuario requerido', 'Por favor seleccione un usuario');
      return;
    }

    const CASH = this.cashes.find(c => c._user._id === this.selectedUser._id && c.type === this.form.controls['type'].value);
    if (CASH) {
      this.toastyService.error('Caja duplicada', 'Ya existe una caja asignada al usuario seleccionado');
      return;
    }

    this.loading = true;
    this.cashService.create({
      ...this.form.value,
      _user: this.selectedUser
    })
      .subscribe(resp => {
        this.toastyService.success('Caja creada exitosamente')
        this.cashService.loadData();
        this.close.emit()
        this.form.reset({
          _user: null,
          type: 'INDEPENDIENTE',
          balance: 0,
        })
        this.loading = false;
      })

  }

}
