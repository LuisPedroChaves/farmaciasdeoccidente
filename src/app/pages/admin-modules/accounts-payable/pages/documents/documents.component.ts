import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';

import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

import { AccountsPayableItem } from 'src/app/core/models/AccountsPayable';
import {
  AccountsPayableCounts,
  AccountsPayablePagedParams,
  AccountsPayableService,
} from 'src/app/core/services/httpServices/accounts-payable.service';
import { AppState } from 'src/app/store/app.reducer';
import { applyPageEvent, createPagedList, invalidatePagedList, PagedList } from '../../paged-list';

type DocumentsTab = 'RETEN' | 'TEMP' | 'PROD' | 'GAST';

const TAB_ORDER: DocumentsTab[] = ['RETEN', 'TEMP', 'PROD', 'GAST'];
const HISTORY_TAB_INDEX = TAB_ORDER.length;

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, OnDestroy {

  /* #region  Header */
  @ViewChild('drawer') drawer: MatDrawer;

  drawerComponent = 'DOCUMENTO';
  title: string;
  accountsPayable: AccountsPayableItem = this.emptyAccountsPayable();
  /* #endregion */
  loading = false;

  /* #region  Listados paginados en el servidor */
  tabs: Record<DocumentsTab, PagedList<AccountsPayableItem>> = {
    RETEN: createPagedList<AccountsPayableItem>(),
    TEMP: createPagedList<AccountsPayableItem>(),
    PROD: createPagedList<AccountsPayableItem>(),
    GAST: createPagedList<AccountsPayableItem>(),
  };
  counts: AccountsPayableCounts = { withholdings: 0, products: 0, expenses: 0, tempCredits: 0 };
  selectedIndex = 0;
  search = '';
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription;
  private refreshSubscription: Subscription;
  /* #endregion */

  /* #region  Historial (rango de fechas, se pagina en memoria) */
  accountsPayablesHistory: AccountsPayableItem[] = [];
  filterHistory = '';
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  /* #endregion */

  sessionSubscription: Subscription;
  permissions: string[] = [];

  constructor(
    private accountsPayableService: AccountsPayableService,
    public store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.sessionSubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      if (session.permissions !== null) {
        const MODULOS = session.permissions.filter(pr => pr.name === 'accountsPyabaleDocuments');
        this.permissions = MODULOS.length > 0 ? MODULOS[0].options : [];
      }
    });

    // La búsqueda viaja al backend; se espera a que el usuario deje de escribir.
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(text => {
        this.search = text;
        this.filterHistory = text;
        TAB_ORDER.forEach(tab => invalidatePagedList(this.tabs[tab], true));
        this.loadActiveTab();
      });

    // Otros componentes (nuevo documento, pago, cheque, anulación) avisan por aquí.
    this.refreshSubscription = this.accountsPayableService.onRefresh()
      .subscribe(() => this.reload());

    //Historial
    this.range.valueChanges
      .pipe(
        debounceTime(500),
      )
      .subscribe(range => {
        if (range.start && range.end) {
          this.history(range.start._d, range.end._d);
        }
      });

    this.loadCounts();
    this.loadActiveTab();
  }

  ngOnDestroy(): void {
    this.sessionSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
    this.refreshSubscription?.unsubscribe();
  }

  /* #region  Carga de pestañas */
  onTabChange(index: number): void {
    this.selectedIndex = index;
    this.loadActiveTab();
  }

  onPage(tab: DocumentsTab, event: PageEvent): void {
    applyPageEvent(this.tabs[tab], event);
    this.loadTab(tab);
  }

  private loadActiveTab(): void {
    const tab = TAB_ORDER[this.selectedIndex];
    if (tab && !this.tabs[tab].loaded) {
      this.loadTab(tab);
    }
  }

  private loadCounts(): void {
    this.accountsPayableService.getUnpaidsCounts()
      .subscribe(counts => this.counts = counts);
  }

  private loadTab(tab: DocumentsTab): void {
    const list = this.tabs[tab];
    const params: AccountsPayablePagedParams = {
      page: list.pageIndex,
      size: list.pageSize,
      search: this.search || undefined,
      ...this.tabParams(tab),
    };

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

  private tabParams(tab: DocumentsTab): Partial<AccountsPayablePagedParams> {
    switch (tab) {
      case 'RETEN': return { withholdings: true };
      case 'TEMP': return { docType: 'CREDITO_TEMP' };
      case 'PROD': return { type: 'PRODUCTOS' };
      case 'GAST': return { type: 'GASTOS' };
    }
  }

  labelReten(): string { return `Retenciones pendientes (${this.counts.withholdings})`; }
  labelTemp(): string { return `Notas de crédito temporales (${this.counts.tempCredits})`; }
  labelProd(): string { return `Pagos a proveedores (${this.counts.products})`; }
  labelGast(): string { return `Gastos internos (${this.counts.expenses})`; }
  /* #endregion */

  applyFilter(filter: string) {
    this.searchSubject.next(filter);
  }

  newDocument(type: string) {
    if (type === 'PRODUCTOS') {
      this.title = 'Nuevo documento de productos'
    } else {
      this.title = 'Nuevo documento de gastos'
    }

    this.drawerComponent = 'DOCUMENTO'
    this.accountsPayable.type = type;
    this.drawer.opened = true;
  }

  editDocument(accountsPayable: AccountsPayableItem) {
    if (accountsPayable.type === 'PRODUCTOS') {
      this.title = 'Editar documento de productos'
    } else {
      this.title = 'Editar documento de gastos'
    }

    this.drawerComponent = 'DOCUMENTO'
    this.accountsPayable = accountsPayable;
    this.drawer.opened = true;
  }

  getAccountPayable(accountsPayable: AccountsPayableItem) {
    this.accountsPayable = accountsPayable;
    this.title = `${accountsPayable.serie} -  ${accountsPayable.noBill}`
    if (accountsPayable.docType === 'FACTURA') {
      this.title += ' | Electrónica'
    }
    if (accountsPayable.docType === 'CAMBIARIA') {
      this.title += ' | Cambiaria electrónica'
    }
    if (accountsPayable.docType === 'PEQUEÑO') {
      this.title += ' | Pequeño contribuyente'
    }
    if (accountsPayable.docType === 'ABONO') {
      this.title += ' | Nota de abono'
    }
    if (accountsPayable.docType === 'CREDITO') {
      this.title += ' | Nota de crédito'
    }
    if (accountsPayable.docType === 'CREDITO_TEMP') {
      this.title += ' | Nota de crédito (Temporal)'
    }
    this.drawerComponent = 'CUENTA'
    this.drawer.opened = true;
  }

  reset(): void {
    this.drawer.opened = false;
    this.drawerComponent = 'DOCUMENTO'
    this.accountsPayable = this.emptyAccountsPayable();
  }

  /** Recarga conteos y la pestaña visible; las demás se recargan al abrirlas. */
  reload() {
    if (this.drawer) {
      this.drawer.opened = false;
    }
    TAB_ORDER.forEach(tab => invalidatePagedList(this.tabs[tab], false));
    this.loadCounts();
    this.loadActiveTab();
  }

  history(startDate, endDate) {
    this.loading = true;
    this.accountsPayableService.getHistory(startDate, endDate)
      .subscribe(data => {
        this.accountsPayablesHistory = data;
        this.loading = false;
      })
  }

  isHistoryTab(): boolean {
    return this.selectedIndex === HISTORY_TAB_INDEX;
  }

  private emptyAccountsPayable(): AccountsPayableItem {
    return {
      _id: null,
      _user: null,
      _provider: null,
      _purchase: null,
      _expense: null,
      date: null,
      serie: '',
      noBill: '',
      docType: '',
      balance: [],
      deletedBalance: [],
      unaffectedAmount: 0,
      exemptAmount: 0,
      netPurchaseAmount: 0,
      netServiceAmount: 0,
      otherTaxes: 0,
      iva: 0,
      total: 0,
      type: 'PRODUCTOS',
      file: '',
      emptyWithholdingIVA: false,
      emptyWithholdingISR: false,
      additionalDiscount: false,
      toCredit: false,
      expirationCredit: null,
      paid: false,
    };
  }

}
