import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';

import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

import { AccountsPayableItem } from 'src/app/core/models/AccountsPayable';
import { CheckItem } from 'src/app/core/models/Check';
import { CheckService, CheckStateCounts } from 'src/app/core/services/httpServices/check.service';
import { READ_CHECKS_TODAY } from 'src/app/store/actions';
import { CheckStore } from 'src/app/store/reducers';
import { FilterPipe } from '../../../../../core/shared/pipes/filterPipes/filter.pipe';
import { applyPageEvent, createPagedList, invalidatePagedList, PagedList } from '../../paged-list';

/** Estados que se listan paginados desde el servidor, en el orden de las pestañas. */
export const CHECK_STATES = ['CREADO', 'ACTUALIZADO', 'INTERBANCO', 'ESPERA', 'AUTORIZADO'] as const;
export type CheckState = typeof CHECK_STATES[number];

/** Índice de pestaña -> estado. La pestaña 1 es "Del día" (store) y la última "Historial". */
const TAB_STATES: (CheckState | null)[] = ['CREADO', null, 'ACTUALIZADO', 'INTERBANCO', 'ESPERA', 'AUTORIZADO', null];
const CHECK_FILTER_FIELDS = ['no', 'date', 'name', 'amount', 'note'];

@Component({
  selector: 'app-cheques',
  templateUrl: './cheques.component.html',
  styleUrls: ['./cheques.component.scss']
})
export class ChequesComponent implements OnInit, OnDestroy {

  /* #region  Header */
  @ViewChild('drawer') drawer: MatDrawer;

  drawerComponent = 'DOCUMENTO';
  title: string;
  accountsPayable: AccountsPayableItem = {
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
  /* #endregion */
  loading = false;

  /* #region  Listados por estado (paginados en el servidor) */
  lists: Record<CheckState, PagedList<CheckItem>> = {
    CREADO: createPagedList<CheckItem>(),
    ACTUALIZADO: createPagedList<CheckItem>(),
    INTERBANCO: createPagedList<CheckItem>(),
    ESPERA: createPagedList<CheckItem>(),
    AUTORIZADO: createPagedList<CheckItem>(),
  };
  counts: CheckStateCounts = {};
  selectedIndex = 0;
  search = '';
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription;
  private refreshSubscription: Subscription;
  /* #endregion */

  /* #region  Del día (store) */
  checkStoreSubscription: Subscription;
  checksToday: CheckItem[] = [];
  checksTodayTemp: CheckItem[] = [];
  /* #endregion */

  /* #region  Historial */
  checksHistory: CheckItem[] = [];
  checksHistoryTemp: CheckItem[] = [];
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  /* #endregion */

  sessionSubscription: Subscription;
  permissions: string[] = [];

  constructor(
    private checkService: CheckService,
    private filter: FilterPipe,
    public store: Store<CheckStore>,
  ) { }

  ngOnInit(): void {
    this.checkStoreSubscription = this.store.select('check')
      .subscribe(state => {
        this.checksTodayTemp = [...state.checksToday]
        this.checksToday = this.filter.transform(this.checksTodayTemp, this.search, CHECK_FILTER_FIELDS);
      })

    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(text => {
        this.search = text;
        // Listas pequeñas (hoy e historial) se filtran en memoria; las de estado van al backend.
        this.checksToday = this.filter.transform(this.checksTodayTemp, text, CHECK_FILTER_FIELDS);
        this.checksHistory = this.filter.transform(this.checksHistoryTemp, text, CHECK_FILTER_FIELDS);
        CHECK_STATES.forEach(state => invalidatePagedList(this.lists[state], true));
        this.loadCounts();
        this.loadActiveTab();
      });

    // Las tarjetas llaman a checkService.loadData() al actualizar o anular un cheque.
    this.refreshSubscription = this.checkService.onRefresh()
      .subscribe(() => this.reload());

    this.range.valueChanges
      .pipe(
        debounceTime(500),
      )
      .subscribe(range => {
        if (range.start && range.end) {
          this.getHistory(range.start._d, range.end._d);
        }
      });

    this.sessionSubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      if (session.permissions !== null) {
        const MODULOS = session.permissions.filter(pr => pr.name === 'accountsPyabaleChecks');
        this.permissions = MODULOS.length > 0 ? MODULOS[0].options : [];
      }
    });

    this.store.dispatch(READ_CHECKS_TODAY())
    this.loadCounts();
    this.loadActiveTab();
  }

  ngOnDestroy(): void {
    this.checkStoreSubscription?.unsubscribe();
    this.sessionSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
    this.refreshSubscription?.unsubscribe();
  }

  /* #region  Carga */
  onTabChange(index: number): void {
    this.selectedIndex = index;
    this.loadActiveTab();
  }

  onPage(state: CheckState, event: PageEvent): void {
    applyPageEvent(this.lists[state], event);
    this.loadState(state);
  }

  reload(): void {
    CHECK_STATES.forEach(state => invalidatePagedList(this.lists[state], false));
    this.loadCounts();
    this.loadActiveTab();
  }

  private loadActiveTab(): void {
    const state = TAB_STATES[this.selectedIndex];
    if (state && !this.lists[state].loaded) {
      this.loadState(state);
    }
  }

  private loadCounts(): void {
    this.checkService.getStateCounts(this.search || undefined)
      .subscribe(counts => this.counts = counts);
  }

  private loadState(state: CheckState): void {
    const list = this.lists[state];
    list.loading = true;
    this.loading = true;
    this.checkService.getStatePaged(state, list.pageIndex, list.pageSize, this.search || undefined)
      .subscribe(
        resp => {
          list.data = resp.checks;
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

  label(state: CheckState, text: string): string {
    return `${text} (${this.counts[state] || 0})`;
  }

  trackById(index: number, check: CheckItem): string {
    return check._id;
  }
  /* #endregion */

  applyFilter(text: string): void {
    this.searchSubject.next(text);
  }

  newDocument(type: string): void {
    if (type === 'PRODUCTOS') {
      this.title = 'Nuevo documento de productos'
    } else {
      this.title = 'Nuevo documento de gastos'
    }

    this.drawerComponent = 'DOCUMENTO'
    this.accountsPayable.type = type;
    this.drawer.opened = true;
  }

  getVoided(_id: string): void {
    this.checksTodayTemp = this.checksTodayTemp.filter(c => c._id !== _id);
    this.checksToday = this.checksToday.filter(c => c._id !== _id);
    CHECK_STATES.forEach(state => {
      const list = this.lists[state];
      const before = list.data.length;
      list.data = list.data.filter(c => c._id !== _id);
      if (list.data.length !== before) {
        list.total = Math.max(0, list.total - 1);
      }
    });
  }

  getHistory(startDate, endDate): void {
    this.loading = true;
    this.checkService.getHistory(startDate, endDate)
      .subscribe(data => {
        this.checksHistoryTemp = data;
        this.checksHistory = this.filter.transform(this.checksHistoryTemp, this.search, CHECK_FILTER_FIELDS);
        this.loading = false;
      })
  }

}
