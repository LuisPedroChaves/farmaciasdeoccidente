import { Component, Input, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
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
export class ProviderAccountComponent implements OnInit, AfterContentInit, OnDestroy {

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

  constructor(
    private accountsPayableService: AccountsPayableService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.accountsPayableSubscription = this.accountsPayableService.readData().subscribe((data) => {
      this.accountsPayable = data;
      this.dataSource = new MatTableDataSource<AccountsPayableItem>(this.accountsPayable);
      this.loading = false
    });
  }

  ngAfterContentInit(): void {
    this.accountsPayableService.loadData();
  }

  ngOnDestroy(): void {
    this.accountsPayableSubscription?.unsubscribe();
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
