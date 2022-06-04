import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import * as moment from 'moment';

import { BankAccountItem, BankFlowItem } from 'src/app/core/models/Bank';
import { OPEN_DRAWER, READ_BANK_ACCOUNTS, SET_BANK_ACCOUNT } from 'src/app/store/actions';
import { BankStore } from 'src/app/store/reducers/bank.reducer';
import { BankFlowService } from 'src/app/core/services/httpServices/bank-flow.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { BankAccountService } from 'src/app/core/services/httpServices/bank-account.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styleUrls: ['./banks.component.scss']
})
export class BanksComponent implements OnInit, OnDestroy {

  @ViewChild('drawer') drawer: MatDrawer;
  drawerSubscription: Subscription;
  drawerComponent: string;

  bankStoreSubscription: Subscription;
  bankAccounts: BankAccountItem[] = [];
  bankAccount: BankAccountItem = null;
  currentBankAccount: string = '';

  range = new FormGroup({
    start: new FormControl('', Validators.required),
    end: new FormControl('', Validators.required)
  });
  bankFlowSubscription: Subscription;
  bankFlows: BankFlowItem[] = [];
  dataSource = new MatTableDataSource();
  columns = [
    'date',
    'document',
    'details',
    'type',
    'credit',
    'debit',
    'balance',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  sessionSubscription: Subscription;
  permissions: string[] = [];

  constructor(
    private store: Store<BankStore>,
    private bankFlowService: BankFlowService,
    private toastyService: ToastyService,
    private bankAccountService: BankAccountService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.sessionSubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      if (session.permissions !== null) {
        const MODULOS = session.permissions.filter(pr => pr.name === 'accountsPyabaleBanks');
        this.permissions = MODULOS.length > 0 ? MODULOS[0].options : [];
      }
    });

    this.drawerSubscription = this.store.select('drawer')
      .subscribe(state => {
        if (this.drawer) {
          this.drawer.opened = state.drawerOpen;
          this.drawerComponent = state.drawerComponent;
        }
      })

    this.bankStoreSubscription = this.store.select('bank')
      .subscribe(state => {

        this.bankAccounts = state.bankAccounts;
        if (state.bankAccount) {
          this.bankAccount = state.bankAccount;
          this.currentBankAccount = state.bankAccount._id
          const FILTER = {
            idBankAccount: this.bankAccount._id,
            startDate: moment(),
            endDate: moment()
          }
          this.bankFlowService.loadData(FILTER);
          this.range.reset()
        }
      })

    this.range.valueChanges
      .pipe(
        debounceTime(500),
      )
      .subscribe(range => {
        if (range.start && range.end) {
          const FILTER = {
            idBankAccount: this.bankAccount._id,
            startDate: range.start,
            endDate: range.end
          }
          this.bankFlowService.loadData(FILTER);
        }
      });

    this.bankFlowSubscription = this.bankFlowService.readData().subscribe((data) => {
      this.bankFlows = data;
      this.dataSource = new MatTableDataSource<BankFlowItem>(this.bankFlows);
      this.dataSource.paginator = this.paginator;
    });

    this.store.dispatch(READ_BANK_ACCOUNTS())

  }

  ngOnDestroy(): void {
    this.bankStoreSubscription?.unsubscribe();
    this.sessionSubscription?.unsubscribe();
    this.bankFlowSubscription?.unsubscribe();
    this.drawerSubscription?.unsubscribe();
  }

  openDrawer(drawerTitle: string, drawerComponent: string): void {
    this.store.dispatch(OPEN_DRAWER({ drawerTitle, drawerComponent }));
  }

  changeAccount() {
    const bankAccount = this.bankAccounts.find(a => a._id === this.currentBankAccount)

    if (bankAccount) {
      this.store.dispatch(SET_BANK_ACCOUNT({ bankAccount }))
    }
  }

  refreshBankAccount(): void {
    this.store.dispatch(READ_BANK_ACCOUNTS())
  }

  editBankAccount() {
    if (!this.permissions.includes('update')) {
      this.toastyService.error('Acceso Denegado', 'Actualmente no cuenta con permisos para realizar para realizar esta acción');
      return
    }

    this.openDrawer('Editar cuenta bancaria', 'EDIT_BANK_ACCOUNT')
  }

  deleteBankAccount() {
    /* #region  Validaciones */
    if (!this.permissions.includes('delete')) {
      this.toastyService.error('Acceso Denegado', 'Actualmente no cuenta con permisos para realizar para realizar esta acción');
      return
    }
    /* #endregion */

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Eliminar Cuenta', message: '¿Confirma que desea anular la cuenta No.  ' + this.bankAccount.no + ' ?', description: true },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {

        this.bankAccountService.delete(this.bankAccount, result)
          .subscribe(resp => {
            this.toastyService.success('Cuenta eliminada exitosamente');
            this.store.dispatch(READ_BANK_ACCOUNTS());
          })
      }
    });
  }

  applyFilter(filter: string): void {
    this.dataSource.filter = filter;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
