import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';

import { Subscription } from 'rxjs';

import { AccountsPayableItem } from 'src/app/core/models/AccountsPayable';

@Component({
  selector: 'app-table-accounts-payable',
  templateUrl: './table-accounts-payable.component.html',
  styleUrls: ['./table-accounts-payable.component.scss']
})
export class TableAccountsPayableComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @Input()
  accountsPayable: AccountsPayableItem[];
  @Input()
  filter: string;
  @Input()
  addSelection = false;
  @Input()
  showProvider = true;

  /* #region  Paginación en el servidor */
  /** `true`: el padre pagina contra el backend y la tabla solo muestra la página recibida. */
  @Input()
  serverSide = false;
  @Input()
  total = 0;
  @Input()
  pageIndex = 0;
  @Input()
  pageSize = 50;
  @Input()
  loading = false;
  @Output()
  page = new EventEmitter<PageEvent>();
  /* #endregion */

  @Output()
  sendSelected = new EventEmitter();
  @Output()
  sendAccountsPayable = new EventEmitter();

  @ViewChild('clientPaginator') clientPaginator: MatPaginator;

  pageSizeOptions = [10, 50, 100];
  dataSource = new MatTableDataSource<AccountsPayableItem>([]);
  selection = new SelectionModel<AccountsPayableItem>(true, []);
  selectionSubscription: Subscription;
  columns = [
    'state',
    'date',
    'noBill',
    'docType',
    '_provider',
    'unaffectedAmount',
    'exemptAmount',
    'netPurchaseAmount',
    'netServiceAmount',
    'otherTaxes',
    'iva',
    'total',
    'expirationCredit',
    'additionalDiscount',
  ];

  constructor() { }

  ngOnInit(): void {
    if (this.addSelection) {
      this.columns.unshift('select');
    }
    if (!this.showProvider) {
      const _provider = this.columns.findIndex(c => c === '_provider');
      this.columns.splice(_provider, 1);
    }
  }

  ngAfterViewInit(): void {
    this.attachClientPaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.accountsPayable) {
      this.dataSource = new MatTableDataSource<AccountsPayableItem>(changes.accountsPayable.currentValue || []);
      this.attachClientPaginator();
      if (this.addSelection) {
        this.resetSelection();
      }
    }
    if (changes.filter && !this.serverSide) {
      // En modo servidor el padre envía la búsqueda al backend; aquí no se filtra en memoria.
      this.dataSource.filter = changes.filter.currentValue;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  ngOnDestroy(): void {
    this.selectionSubscription?.unsubscribe();
  }

  private attachClientPaginator(): void {
    if (!this.serverSide && this.clientPaginator) {
      this.dataSource.paginator = this.clientPaginator;
    }
  }

  private resetSelection(): void {
    this.selectionSubscription?.unsubscribe();
    this.selection = new SelectionModel<AccountsPayableItem>(true, []);
    this.sendSelected.emit([]);
    this.selectionSubscription = this.selection.changed // Observable para obtener los ultimos cambios de la seccion en la tabla
      .subscribe(() => this.sendSelected.emit(this.selection.selected));
  }

  onPage(event: PageEvent): void {
    this.page.emit(event);
  }

  /* #region  Gets */
  getWithholdings(account: AccountsPayableItem): boolean {
    return (account._provider.iva && account.emptyWithholdingIVA) || (account._provider.isr && account.emptyWithholdingISR)
  }

  getExpired(expirationCredit: Date): boolean {
    return new Date(expirationCredit) < new Date()
  }

  trackById(index: number, item: AccountsPayableItem): string {
    return item._id;
  }
  /* #endregion */

  /* #region  SELECTION TABLE */

  /** Si el número de elementos seleccionados coincide con el número total de filas. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selecciona todas las filas si no están todas seleccionadas; en caso contrario, borra la selección. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: AccountsPayableItem): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.total + 1}`;
  }
  /* #endregion */

}
