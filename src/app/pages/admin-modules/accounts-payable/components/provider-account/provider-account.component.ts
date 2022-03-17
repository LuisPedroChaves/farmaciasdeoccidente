import { Component, Input, OnInit, AfterContentInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import { Subscription } from 'rxjs';

import { ProviderItem } from '../../../../../core/models/Provider';
import { AccountsPayableService } from '../../../../../core/services/httpServices/accounts-payable.service';
import { AccountsPayableItem } from '../../../../../core/models/AccountsPayable';

@Component({
  selector: 'app-provider-account',
  templateUrl: './provider-account.component.html',
  styleUrls: ['./provider-account.component.scss']
})
export class ProviderAccountComponent implements OnInit, AfterContentInit, OnDestroy, OnChanges {

  @Input() provider: ProviderItem;

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
  loading = false;
  accountsPayableSubscription: Subscription;
  accountsPayable: AccountsPayableItem[];
  accountsPayableTemp: AccountsPayableItem[];

  constructor(
    private accountsPayableService: AccountsPayableService,
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
      const PROVIDER: AccountsPayableItem = changes.provider.currentValue;

      if (this.accountsPayable) {
        this.accountsPayableTemp = this.accountsPayable.filter(ap => ap._provider._id === PROVIDER._id)
        this.dataSource = new MatTableDataSource<AccountsPayableItem>(this.accountsPayableTemp);
      } else {
        this.loading = true;
        this.accountsPayableSubscription = this.accountsPayableService.readData().subscribe((data) => {
          console.log('SUBSCRIPTION');
          this.accountsPayable = data;
          this.accountsPayableTemp = this.accountsPayable.filter(ap => ap._provider._id === PROVIDER._id)
          this.dataSource = new MatTableDataSource<AccountsPayableItem>(this.accountsPayableTemp);
          this.loading = false
        });
      }
    }
  }

  getTotalBills(): number {
    return this.accountsPayableTemp.reduce((sum, item) => sum + item.total, 1);
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

}
