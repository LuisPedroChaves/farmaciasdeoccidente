import { Component, Input, OnInit, AfterContentInit, OnDestroy, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDrawer } from '@angular/material/sidenav';

import { Subscription } from 'rxjs';

import { ProviderItem } from '../../../../../core/models/Provider';
import { AccountsPayableService } from '../../../../../core/services/httpServices/accounts-payable.service';
import { AccountsPayableItem } from '../../../../../core/models/AccountsPayable';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';

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

  @Input() provider: ProviderItem;
  @ViewChild('drawer') drawer: MatDrawer;

  loading = false;
  accountsPayableSubscription: Subscription;
  accountsPayables: AccountsPayableItem[];

  /* #region  Pendientes */
  dataSource = new MatTableDataSource([]);
  selection = new SelectionModel<AccountsPayableItem>(true, []);
  columns = [
    'select',
    'state',
    'date',
    'noBill',
    'docType',
    'unaffectedAmount',
    'exemptAmount',
    'netPurchaseAmount',
    'netServiceAmount',
    'otherTaxes',
    'iva',
    'total',
    'expirationCredit',
  ];
  accountsPayablePend: AccountsPayableItem[];
  /* #endregion */

  /* #region  En Proceso */
  dataSource2 = new MatTableDataSource([]);
  columns2 = [
    'check',
    'state',
    'date',
    'noBill',
    'docType',
    'unaffectedAmount',
    'exemptAmount',
    'netPurchaseAmount',
    'netServiceAmount',
    'otherTaxes',
    'iva',
    'total',
    'expirationCredit',
  ];
  accountsPayableProcess: AccountsPayableItem[];
  /* #endregion */

  constructor(
    private accountsPayableService: AccountsPayableService,
    private toastyService: ToastyService
  ) { }

  ngOnInit(): void {

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
    this.accountsPayablePend = this.accountsPayables.filter(ap => ap._provider._id === provider._id && !ap._check)
    this.accountsPayableProcess = this.accountsPayables.filter(ap => ap._provider._id === provider._id && ap._check)
    this.dataSource = new MatTableDataSource<AccountsPayableItem>(this.accountsPayablePend);
    this.dataSource2 = new MatTableDataSource<AccountsPayableItem>(this.accountsPayableProcess);
    this.selection = new SelectionModel<AccountsPayableItem>(true, []);
  }

  applyFilterPend(filter: string) {
    this.dataSource.filter = filter

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilterProcess(filter: string) {
    this.dataSource2.filter = filter

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }

  newCheck() {
    if (this.selection.selected.length === 0) {
      this.toastyService.toasty('warning', 'Ningún documento seleccionado', 'Por favor seleccione los documentos a pagar')
      return;
    }
    this.drawer.toggle();
  }

  /* #region  Cards */
  getTotalBills(): number {
    return this.accountsPayablePend ? this.accountsPayablePend.reduce((sum, item) => {
      if (item.docType !== 'ABONO' && item.docType !== 'CREDITO') {
        return sum + item.total;
      } else {
        return sum + 0;
      }
    }, 0) : 0;
  }

  getTotalAbono(): number {
    return this.accountsPayablePend ? this.accountsPayablePend.reduce((sum, item) => {
      if (item.docType === 'ABONO') {
        return sum + item.total;
      } else {
        return sum + 0;
      }
    }, 0) : 0;
  }

  getTotalCredito(): number {
    return this.accountsPayablePend ? this.accountsPayablePend.reduce((sum, item) => {
      if (item.docType === 'CREDITO') {
        return sum + item.total;
      } else {
        return sum + 0;
      }
    }, 0) : 0;
  }
  /* #endregion */

  /* #region  Tabs */
  getTotalPending(): string {
    if (this.accountsPayablePend) {
      return `Pendientes (${this.accountsPayablePend.length})`
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

  /* #region  Chips */
  getTotalWithholdings(): number {
    return 0
  }
  /* #endregion */

  /* #region  SELECTION TABLE */
  // Calcular totales seleccionados
  getTotalsSelection(): totalSelection {
    let totals: totalSelection = {
      facturas: {
        total: this.selection.selected.filter(s => s.docType !== 'ABONO' && s.docType !== 'CREDITO').length,
        amount: this.selection.selected.reduce((sum, item) => {
          if (item.docType !== 'ABONO' && item.docType !== 'CREDITO') {
            return sum + item.total
          } else {
            return sum + 0;
          }
        }, 0)
      },
      abonos: {
        total: this.selection.selected.filter(s => s.docType === 'ABONO').length,
        amount: this.selection.selected.reduce((sum, item) => {
          if (item.docType === 'ABONO') {
            return sum + item.total
          } else {
            return sum + 0;
          }
        }, 0)
      },
      creditos: {
        total: this.selection.selected.filter(s => s.docType === 'CREDITO').length,
        amount: this.selection.selected.reduce((sum, item) => {
          if (item.docType === 'CREDITO') {
            return sum + item.total
          } else {
            return sum + 0;
          }
        }, 0)
      },
      total: this.selection.selected.reduce((sum, item) => {
        if (item.docType !== 'ABONO' && item.docType !== 'CREDITO') {
          return sum + item.total
        } else {
          return sum - item.total;
        }
      }, 0)
    }
    if (this.selection.selected) {

    }
    return totals;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
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
