import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { MatChip } from '@angular/material/chips';
import { PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@angular/forms';

import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ProviderItem } from '../../../../../core/models/Provider';
import {
  AccountsPayablePagedParams,
  AccountsPayableService,
  EMPTY_PROVIDER_TOTALS,
  ProviderTotals,
} from '../../../../../core/services/httpServices/accounts-payable.service';
import { AccountsPayableItem } from '../../../../../core/models/AccountsPayable';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { applyPageEvent, createPagedList, invalidatePagedList, PagedList } from '../../paged-list';

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

type PendingFilter = 'ALL' | 'WITHHOLDINGS' | 'EXPIRED';
type ProviderTab = 'PENDING' | 'PROCESS';

const TAB_ORDER: ProviderTab[] = ['PENDING', 'PROCESS'];

@Component({
  selector: 'app-provider-account',
  templateUrl: './provider-account.component.html',
  styleUrls: ['./provider-account.component.scss']
})
export class ProviderAccountComponent implements OnInit, OnDestroy, OnChanges {

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
  totals: ProviderTotals = { ...EMPTY_PROVIDER_TOTALS };

  /* #region  Pendientes (paginado en el servidor) */
  pending = createPagedList<AccountsPayableItem>();
  pendingFilter: PendingFilter = 'ALL';
  selectedPend: AccountsPayableItem[] = [];
  totalsSelection: totalSelection = this.emptyTotalsSelection();
  /* #endregion */

  /* #region  En Proceso (paginado en el servidor) */
  process = createPagedList<AccountsPayableItem>();
  /* #endregion */

  /* #region  Historial (rango de fechas, se pagina en memoria) */
  accountsPayablesHistory: AccountsPayableItem[];
  filterHistory = '';
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  /* #endregion */

  selectedIndex = 0;
  private search: Record<ProviderTab, string> = { PENDING: '', PROCESS: '' };
  private searchSubject = new Subject<{ tab: ProviderTab, text: string }>();
  private searchSubscription: Subscription;
  private refreshSubscription: Subscription;

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

    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged((a, b) => a.tab === b.tab && a.text === b.text),
      )
      .subscribe(({ tab, text }) => {
        this.search[tab] = text;
        invalidatePagedList(this.listOf(tab), true);
        this.loadTab(tab);
      });

    // Pagos, retenciones y anulaciones hechas desde otros componentes.
    this.refreshSubscription = this.accountsPayableService.onRefresh()
      .subscribe(() => this.reload());
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
    this.refreshSubscription?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.provider && changes.provider.currentValue) {
      this.pendingFilter = 'ALL';
      this.search = { PENDING: '', PROCESS: '' };
      this.pending = createPagedList<AccountsPayableItem>();
      this.process = createPagedList<AccountsPayableItem>();
      this.accountsPayablesHistory = undefined;
      this.selectedPend = [];
      this.totalsSelection = this.emptyTotalsSelection();
      this.reload();
    }
  }

  /* #region  Carga */
  reload(): void {
    if (!this.provider) {
      return;
    }
    this.loadTotals();
    TAB_ORDER.forEach(tab => invalidatePagedList(this.listOf(tab), false));
    this.loadActiveTab();
    if (this.all) {
      this.all.selected = this.pendingFilter === 'ALL'; // Marcamos el filtro TODOS como mat-chip selected
    }
  }

  onTabChange(index: number): void {
    this.selectedIndex = index;
    this.loadActiveTab();
  }

  onPage(tab: ProviderTab, event: PageEvent): void {
    applyPageEvent(this.listOf(tab), event);
    this.loadTab(tab);
  }

  private listOf(tab: ProviderTab): PagedList<AccountsPayableItem> {
    return tab === 'PENDING' ? this.pending : this.process;
  }

  private loadActiveTab(): void {
    const tab = TAB_ORDER[this.selectedIndex];
    if (tab && !this.listOf(tab).loaded) {
      this.loadTab(tab);
    }
  }

  private loadTotals(): void {
    this.accountsPayableService.getProviderTotals(this.provider._id)
      .subscribe(totals => this.totals = totals);
  }

  private loadTab(tab: ProviderTab): void {
    const list = this.listOf(tab);
    const params: AccountsPayablePagedParams = {
      page: list.pageIndex,
      size: list.pageSize,
      _provider: this.provider._id,
      pending: tab === 'PENDING',
      search: this.search[tab] || undefined,
    };
    if (tab === 'PENDING' && this.pendingFilter === 'WITHHOLDINGS') {
      params.withholdings = true;
    }
    if (tab === 'PENDING' && this.pendingFilter === 'EXPIRED') {
      params.expired = true;
    }

    list.loading = true;
    this.loading = true;
    this.accountsPayableService.getUnpaidsPaged(params)
      .subscribe(
        resp => {
          list.data = resp.accountsPayables;
          list.total = resp.total;
          list.loaded = true;
          list.loading = false;
          this.loading = false;
        },
        () => {
          list.loading = false;
          this.loading = false;
        }
      );
  }
  /* #endregion */

  applyFilterPend(filter: string) {
    this.searchSubject.next({ tab: 'PENDING', text: filter });
  }

  applyFilterProcess(filter: string) {
    this.searchSubject.next({ tab: 'PROCESS', text: filter });
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
    // Se calcula una sola vez por cambio de selección, no en cada ciclo de detección de cambios.
    this.totalsSelection = this.calculateTotalsSelection();
  }

  getTotalsSelection(): totalSelection {
    return this.totalsSelection;
  }

  private calculateTotalsSelection(): totalSelection {
    const isBill = (item: AccountsPayableItem) => item.docType !== 'ABONO' && item.docType !== 'CREDITO' && item.docType !== 'CREDITO_TEMP';
    const pendingAmount = (item: AccountsPayableItem) => item.total - item.balance.reduce((sum, b) => sum += b.amount, 0);

    const totals: totalSelection = this.emptyTotalsSelection();
    this.selectedPend.forEach(item => {
      if (isBill(item)) {
        totals.facturas.total++;
        totals.facturas.amount += pendingAmount(item);
        totals.total += pendingAmount(item);
      } else if (item.docType === 'ABONO') {
        totals.abonos.total++;
        totals.abonos.amount += item.total;
        totals.total -= item.total;
      } else {
        totals.creditos.total++;
        totals.creditos.amount += item.total;
        totals.total -= item.total;
      }
    });
    return totals;
  }

  private emptyTotalsSelection(): totalSelection {
    return {
      facturas: { total: 0, amount: 0 },
      abonos: { total: 0, amount: 0 },
      creditos: { total: 0, amount: 0 },
      total: 0,
    };
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

    if (this.totalsSelection.total <= 0) {
      this.toastyService.error('Monto incorrecto', 'El total a pagar debe ser mayor a cero')
      return
    }

    this.drawer.toggle();
  }

  closePay(amount: number) {
    this.provider.balance -= amount;
    this.drawer.opened = false
    // El componente de pago llama a accountsPayableService.loadData(), que dispara reload().
  }
  /* #endregion */

  /* #region  Chips */
  getTotalWithholdings(): number {
    return this.totals.withholdings;
  }

  getTotalExpired(): number {
    return this.totals.expired;
  }

  getAll(chip: MatChip) {
    this.setPendingFilter(chip, 'ALL');
  }

  getWithholdings(chip: MatChip): void {
    this.setPendingFilter(chip, 'WITHHOLDINGS');
  }

  getExpired(chip: MatChip): void {
    this.setPendingFilter(chip, 'EXPIRED');
  }

  private setPendingFilter(chip: MatChip, filter: PendingFilter): void {
    chip.selected = true;
    if (this.pendingFilter === filter) {
      return;
    }
    this.pendingFilter = filter;
    invalidatePagedList(this.pending, true);
    this.loadTab('PENDING');
  }
  /* #endregion */

  /* #region  Cards */
  getTotalBills(): number {
    return this.totals.bills;
  }

  getTotalAbono(): number {
    return this.totals.credits;
  }

  getTotalCredito(): number {
    return this.totals.creditNotes;
  }
  /* #endregion */

  /* #region  Tabs */
  getTotalPending(): string {
    return `Pendientes (${this.totals.pending})`
  }

  getTotalProcess(): string {
    return `En proceso (${this.totals.inProcess})`
  }
  /* #endregion */

}
