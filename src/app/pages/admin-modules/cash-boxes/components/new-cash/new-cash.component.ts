import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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
export class NewCashComponent implements OnInit, OnChanges {

  @Input() cashes: CashItem[] = [];
  @Input() cash!: CashItem;
  @Output() close = new EventEmitter;

  loading = false;

  form = new FormGroup({
    type: new FormControl('INDEPENDIENTE', Validators.required),
    balance: new FormControl(0, Validators.required),
  });

  selectedAdmin: UserItem;
  selectedUser: UserItem;

  constructor(
    private cashService: CashService,
    private toastyService: ToastyService,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cash']) {
      this.selectedAdmin = changes['cash'].currentValue._admin;
      this.selectedUser = changes['cash'].currentValue._user;
    }
  }

  getAdmin(user: UserItem): void {
    this.selectedAdmin = user;
  }

  getUser(user: UserItem): void {
    this.selectedUser = user;
  }

  save(): void {
    if (!this.selectedUser || !this.selectedAdmin) {
      this.toastyService.error('Usuarios requeridos', 'Por favor seleccione un usuario');
      return;
    }
    if (this.cash) {
      this.loading = true;
      this.cash._admin = this.selectedAdmin;
      this.cashService.update({
        ...this.cash
      })
        .subscribe(resp => {
          this.toastyService.success('Caja editada exitosamente')
          this.cashService.loadData();
          this.close.emit()
          this.form.reset({
            type: 'INDEPENDIENTE',
            balance: 0,
          })
          this.loading = false;
        })
    } else {
      const CASH = this.cashes.find(c => c._user._id === this.selectedUser._id && c.type === this.form.controls['type'].value);
      if (CASH) {
        this.toastyService.error('Caja duplicada', 'Ya existe una caja asignada al usuario seleccionado');
        return;
      }

      this.loading = true;
      this.cashService.create({
        ...this.form.value,
        _admin: this.selectedAdmin,
        _user: this.selectedUser,
      })
        .subscribe(resp => {
          this.toastyService.success('Caja creada exitosamente')
          this.cashService.loadData();
          this.close.emit()
          this.form.reset({
            type: 'INDEPENDIENTE',
            balance: 0,
          })
          this.loading = false;
        })
    }
  }
}
