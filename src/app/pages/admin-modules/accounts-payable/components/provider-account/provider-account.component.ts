import { Component, Input, OnInit, AfterContentInit, OnDestroy, OnChanges, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { MatChip } from '@angular/material/chips';

import { Subscription } from 'rxjs';

import { ProviderItem } from '../../../../../core/models/Provider';
import { AccountsPayableService } from '../../../../../core/services/httpServices/accounts-payable.service';
import { AccountsPayableItem } from '../../../../../core/models/AccountsPayable';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

interface totalSelection {
  facturas: {
    total: number,
    amount: number,
  },
  abonos: {
    total: number,
    amount: number,
  },
  creditos: {
    total: number,
    amount: number,
  },
  total: number
}

@Component({
  selector: 'app-provider-account',
  templateUrl: './provider-account.component.html',
  styleUrls: ['./provider-account.component.scss']
})
export class ProviderAccountComponent implements OnInit, AfterContentInit, OnDestroy, OnChanges {

  @Input()
  provider: ProviderItem;
  @Input()
  permissions: string[] = [];
  @Output()
  sendAccountsPayable = new EventEmitter();
  @ViewChild('drawer')
  drawer: MatDrawer;
  @ViewChild('all')
  all: MatChip;

  loading = false;
  accountsPayableSubscription: Subscription;
  accountsPayables: AccountsPayableItem[];

  /* #region  Pendientes */
  accountsPayablePend: AccountsPayableItem[];
  accountsPayablePendTEMP: AccountsPayableItem[]; // Sirve para filtros
  selectedPend: AccountsPayableItem[] = [];
  filterPend = '';
  /* #endregion */

  /* #region  En Proceso */
  accountsPayableProcess: AccountsPayableItem[];
  filterProcess = '';
  /* #endregion */

/* #region  Historial */
  accountsPayablesHistory: AccountsPayableItem[];
  filterHistory = '';
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
/* #endregion */

  constructor(
    private accountsPayableService: AccountsPayableService,
    private toastyService: ToastyService
  ) { }

  ngOnInit(): void {
    this.range.valueChanges
    .pipe(
      debounceTime(500),
    )
    .subscribe(range => {
      if (range.start && range.end) {
        this.getHistory(range.start._d, range.end._d);
      }
    });
  }

  ngAfterContentInit(): void {
    this.accountsPayableService.loadData();
  }

  ngOnDestroy(): void {
    this.accountsPayableSubscription?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.provider) {
      const PROVIDER: ProviderItem = changes.provider.currentValue;

      if (this.accountsPayables) {
        this.fillDataSources(PROVIDER);
      } else {
        this.loading = true;
        this.accountsPayableSubscription = this.accountsPayableService.readData().subscribe((data) => {
          console.log('SUBSCRIPTION');
          this.accountsPayables = data;
          this.fillDataSources(PROVIDER);
          this.loading = false
        });
      }
    }
  }

  fillDataSources(provider: ProviderItem): void {
    this.accountsPayablePendTEMP = this.accountsPayables.filter(ap => (ap._provider._id === provider._id) && (!ap.balance.find(b => b.credit === 'CHEQUE')))
    this.accountsPayablePend = this.accountsPayablePendTEMP;
    this.selectedPend = [];
    this.accountsPayableProcess = this.accountsPayables.filter(ap => (ap._provider._id === provider._id) && (ap.balance.find(b => b.credit === 'CHEQUE')))
    this.all.selected = true; // Marcamos el filtro TODOS como mat-chip selected
  }

  applyFilterPend(filter: string) {
    this.filterPend = filter
  }

  applyFilterProcess(filter: string) {
    this.filterProcess = filter;
  }

  applyFilterHistory(filter: string) {
    this.filterHistory = filter;
  }

  getHistory(startDate, EndDate) {
    this.loading = true;
    this.accountsPayableService.getHistory(startDate, EndDate, this.provider._id)
      .subscribe(data => {
        this.accountsPayablesHistory = data;
        this.loading = false;
      });
  }

  /* #region  Selected */
  getSelected(accountsPayables: AccountsPayableItem[]) {
    this.selectedPend = accountsPayables;
  }

  // Calcular totales seleccionados
  getTotalsSelection(): totalSelection {
    let totals: totalSelection = {
      facturas: {
        total: this.selectedPend.filter(s => s.docType !== 'ABONO' && s.docType !== 'CREDITO' && s.docType !== 'CREDITO_TEMP').length,
        amount: this.selectedPend.reduce((sum, item) => {
          if (item.docType !== 'ABONO' && item.docType !== 'CREDITO' && item.docType !== 'CREDITO_TEMP') {
            return sum + (item.total - item.balance.reduce((sum, item) => sum += item.amount, 0))
          } else {
            return sum + 0;
          }
        }, 0)
      },
      abonos: {
        total: this.selectedPend.filter(s => s.docType === 'ABONO').length,
        amount: this.selectedPend.reduce((sum, item) => {
          if (item.docType === 'ABONO') {
            return sum + item.total
          } else {
            return sum + 0;
          }
        }, 0)
      },
      creditos: {
        total: this.selectedPend.filter(s => s.docType === 'CREDITO' || s.docType === 'CREDITO_TEMP').length,
        amount: this.selectedPend.reduce((sum, item) => {
          if (item.docType === 'CREDITO' || item.docType === 'CREDITO_TEMP') {
            return sum + item.total
          } else {
            return sum + 0;
          }
        }, 0)
      },
      total: this.selectedPend.reduce((sum, item) => {
        if (item.docType !== 'ABONO' && item.docType !== 'CREDITO' && item.docType !== 'CREDITO_TEMP') {
          return sum + (item.total - item.balance.reduce((sum, item) => sum += item.amount, 0))
        } else {
          return sum - item.total;
        }
      }, 0)
    }
    return totals;
  }
  /* #endregion */

  /* #region  Pays */
  newPay() {
    if (!this.permissions.includes('update')) {
      this.toastyService.error('Acceso Denegado', 'Actualmente no cuenta con permisos para realizar esta acción')
      return
    }
    if (this.selectedPend.length === 0) {
      this.toastyService.toasty('warning', 'Ningún documento seleccionado', 'Por favor seleccione los documentos a pagar')
      return;
    }

    if (this.selectedPend.filter(a => (a._provider.iva && a.emptyWithholdingIVA) || (a._provider.isr && a.emptyWithholdingISR)).length > 0) {
      this.toastyService.error('Documentos con retenciones pendientes', 'Primero ingrese las retenciones');
      return;
    }

    if (this.getTotalsSelection().total <= 0) {
      this.toastyService.error('Monto incorrecto', 'El total a pagar debe ser mayor a cero')
      return
    }

    this.drawer.toggle();
  }

  closePay(amount: number) {
    this.provider.balance -= amount;
    this.drawer.opened = false
  }
  /* #endregion */

  /* #region  Chips */
  getTotalWithholdings(): number {
    return this.accountsPayablePendTEMP ? this.accountsPayablePendTEMP.reduce((sum, a) => {
      if ((a._provider.iva && a.emptyWithholdingIVA) || (a._provider.isr && a.emptyWithholdingISR)) {
        sum++
      } else {
        sum += 0;
      }
      return sum;
    }, 0) : 0;
  }

  getTotalExpired(): number {
    return this.accountsPayablePendTEMP ? this.accountsPayablePendTEMP.reduce((sum, a) => {
      if (a.expirationCredit && new Date(a.expirationCredit) < new Date()) {
        sum++;
      } else {
        sum += 0;
      }
      return sum;
    }, 0) : 0;
  }

  getAll(chip: MatChip) {
    chip.selected = true;
    this.accountsPayablePend = this.accountsPayablePendTEMP;
  }

  getWithholdings(chip: MatChip): void {
    chip.selected = true;
    this.accountsPayablePend = this.accountsPayablePendTEMP.filter(a => (a._provider.iva && a.emptyWithholdingIVA) || (a._provider.isr && a.emptyWithholdingISR));
  }

  getExpired(chip: MatChip): void {
    chip.selected = true;
    this.accountsPayablePend = this.accountsPayablePendTEMP.filter(a => (a.expirationCredit && new Date(a.expirationCredit) < new Date()));
  }

  /* #endregion */

  /* #region  Cards */
  getTotalBills(): number {
    return this.accountsPayables ? this.accountsPayables.filter(ap => (ap._provider._id === this.provider._id)).reduce((sum, item) => {
      if (item.docType !== 'ABONO' && item.docType !== 'CREDITO' && item.docType !== 'CREDITO_TEMP') {
        return sum + (item.total - item.balance.reduce((sum, item) => {
          if (item.credit !== 'CHEQUE') {
            return sum + item.amount
          } else {
            return sum + 0;
          }
        }, 0));
      } else {
        return sum + 0;
      }
    }, 0) : 0;
  }

  getTotalAbono(): number {
    return this.accountsPayables ? this.accountsPayables.filter(ap => (ap._provider._id === this.provider._id)).reduce((sum, item) => {
      if (item.docType === 'ABONO') {
        return sum + item.total;
      } else {
        return sum + 0;
      }
    }, 0) : 0;
  }

  getTotalCredito(): number {
    return this.accountsPayables ? this.accountsPayables.filter(ap => (ap._provider._id === this.provider._id)).reduce((sum, item) => {
      if (item.docType === 'CREDITO' || item.docType === 'CREDITO_TEMP') {
        return sum + item.total;
      } else {
        return sum + 0;
      }
    }, 0) : 0;
  }
  /* #endregion */

  /* #region  Tabs */
  getTotalPending(): string {
    if (this.accountsPayablePendTEMP) {
      return `Pendientes (${this.accountsPayablePendTEMP.length})`
    } else {
      return 'Pendientes (0)'
    }
  }

  getTotalProcess(): string {
    if (this.accountsPayableProcess) {
      return `En proceso (${this.accountsPayableProcess.length})`
    } else {
      return 'En proceso (0)'
    }
  }
  /* #endregion */

}
