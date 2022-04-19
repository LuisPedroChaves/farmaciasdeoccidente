import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import { AccountsPayableItem } from 'src/app/core/models/AccountsPayable';

@Component({
  selector: 'app-table-accounts-payable',
  templateUrl: './table-accounts-payable.component.html',
  styleUrls: ['./table-accounts-payable.component.scss']
})
export class TableAccountsPayableComponent implements OnInit, OnChanges {

  @Input()
  accountsPayable: AccountsPayableItem[];
  @Input()
  filter: string;
  @Input()
  addSelection = false;
  @Input()
  showProvider = true;
  @Output()
  sendSelected = new EventEmitter();
  @Output()
  sendAccountsPayable = new EventEmitter();

  dataSource = new MatTableDataSource([]);
  selection = new SelectionModel<AccountsPayableItem>(true, []);
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.accountsPayable) {
      this.dataSource = new MatTableDataSource<AccountsPayableItem>(changes.accountsPayable.currentValue);
      if (this.addSelection) {
        this.selection = new SelectionModel<AccountsPayableItem>(true, []);
        this.selection.changed // Observable para obtener los ultimos cambios de la seccion en la tabla
          .subscribe(next => this.sendSelected.emit(this.selection.selected));
      }
    }
    if (changes.filter) {
      this.dataSource.filter = changes.filter.currentValue;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  /* #region  Gets */
  getWithholdings(account: AccountsPayableItem): boolean {
    return (account._provider.iva && account.emptyWithholdingIVA) || (account._provider.isr && account.emptyWithholdingISR)
  }

  getExpired(expirationCredit: Date): boolean {
    return new Date(expirationCredit) < new Date()
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
