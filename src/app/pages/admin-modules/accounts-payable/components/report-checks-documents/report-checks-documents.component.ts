import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CheckItem } from 'src/app/core/models/Check';
import { AccountsPayableItem } from 'src/app/core/models/AccountsPayable';

@Component({
  selector: 'app-report-checks-documents',
  templateUrl: './report-checks-documents.component.html',
  styleUrls: ['./report-checks-documents.component.scss'],
})
export class ReportChecksDocumentsComponent implements OnInit {
  accountsPayables: AccountsPayableItem[] = [];
  filteredAccountsPayables: AccountsPayableItem[] = [];

  constructor(
    public dialogRef: MatDialogRef<ReportChecksDocumentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { check: CheckItem }
  ) {}

  ngOnInit(): void {
    this.accountsPayables = this.data.check.accountsPayables || [];
    this.filteredAccountsPayables = this.accountsPayables;
  }

  documentLabel(account: AccountsPayableItem): string {
    const prefix =
      account.docType === 'ABONO' ||
      account.docType === 'CREDITO' ||
      account.docType === 'CREDITO_TEMP'
        ? 'N'
        : 'F';
    return `${prefix}${account.noBill}`;
  }

  applyFilter(filter: string): void {
    if (!filter) {
      this.filteredAccountsPayables = this.accountsPayables;
      return;
    }

    this.filteredAccountsPayables = this.accountsPayables.filter((account) => {
      const document = this.documentLabel(account).toLowerCase();
      const date = account.date
        ? new Date(account.date).toLocaleDateString('es-GT')
        : '';
      const total = account.total != null ? account.total.toFixed(2) : '';

      return (
        document.includes(filter) ||
        date.includes(filter) ||
        total.includes(filter)
      );
    });
  }
}
