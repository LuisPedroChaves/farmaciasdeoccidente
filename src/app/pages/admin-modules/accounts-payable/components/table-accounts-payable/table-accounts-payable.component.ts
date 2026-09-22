import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { AccountsPayableItem } from 'src/app/core/models/AccountsPayable';

@Component({
  selector: 'app-table-accounts-payable',
  templateUrl: './table-accounts-payable.component.html',
  styleUrls: ['./table-accounts-payable.component.scss']
})
export class TableAccountsPayableComponent implements OnInit, OnChanges, AfterViewInit {

  @Input()
  accountsPayable: AccountsPayableItem[];
  @Input()
  filter: string;
  @Input()
  addSelection = false;
  @Input()
  showProvider = true;
  /** IDs seleccionados, mantenidos por el padre para que la selección sobreviva al cambio de página. */
  @Input()
  selectedIds: Set<string> = new Set();

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

  /** Una fila cambió su estado de selección. */
  @Output()
  rowToggled = new EventEmitter<AccountsPayableItem>();
  /** Se activó/desactivó "seleccionar todos" para las filas de la página actual. */
  @Output()
  pageToggled = new EventEmitter<{ rows: AccountsPayableItem[], select: boolean }>();
  @Output()
  sendAccountsPayable = new EventEmitter();

  @ViewChild('clientPaginator') clientPaginator: MatPaginator;

  pageSizeOptions = [10, 50, 100];
  dataSource = new MatTableDataSource<AccountsPayableItem>([]);
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
    }
    if (changes.filter && !this.serverSide) {
      // En modo servidor el padre envía la búsqueda al backend; aquí no se filtra en memoria.
      this.dataSource.filter = changes.filter.currentValue;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  private attachClientPaginator(): void {
    if (!this.serverSide && this.clientPaginator) {
      this.dataSource.paginator = this.clientPaginator;
    }
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
  /** La selección vive en el padre (por _id) para sobrevivir al cambio de página. */

  isSelected(row: AccountsPayableItem): boolean {
    return this.selectedIds?.has(row._id) ?? false;
  }

  /** Si alguna fila de la página actual está seleccionada. */
  hasSelection(): boolean {
    return this.dataSource.data.some(row => this.isSelected(row));
  }

  /** Si todas las filas de la página actual están seleccionadas. */
  isAllSelected(): boolean {
    return this.dataSource.data.length > 0 && this.dataSource.data.every(row => this.isSelected(row));
  }

  /** Selecciona/deselecciona todas las filas de la página actual. */
  masterToggle(): void {
    this.pageToggled.emit({ rows: this.dataSource.data, select: !this.isAllSelected() });
  }

  toggleRow(row: AccountsPayableItem): void {
    this.rowToggled.emit(row);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: AccountsPayableItem): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.isSelected(row) ? 'deselect' : 'select'} row ${row.total + 1}`;
  }
  /* #endregion */

}
