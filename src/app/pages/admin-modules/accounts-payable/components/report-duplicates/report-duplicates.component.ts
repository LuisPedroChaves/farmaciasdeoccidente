import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { debounceTime } from 'rxjs/operators';
import { AccountsPayableDuplicateItem } from 'src/app/core/models/AccountsPayable';
import { ProviderItem } from 'src/app/core/models/Provider';
import { AccountsPayableService } from 'src/app/core/services/httpServices/accounts-payable.service';

@Component({
  selector: 'app-report-duplicates',
  templateUrl: './report-duplicates.component.html',
  styleUrls: ['./report-duplicates.component.scss']
})
export class ReportDuplicatesComponent implements OnInit {

  loading = false;
  selectedProvider: ProviderItem;
  range = new FormGroup({
    start: new FormControl(''),
    end: new FormControl('')
  });
  duplicates: AccountsPayableDuplicateItem[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;
  columns = ['provider', 'noBill', 'count', 'lastDate'];
  expandedElement: AccountsPayableDuplicateItem | null = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private accountsPayableService: AccountsPayableService,
  ) { }

  ngOnInit(): void {
    this.range.valueChanges
      .pipe(
        debounceTime(500),
      )
      .subscribe(range => {
        if ((range.start && range.end) || (!range.start && !range.end)) {
          this.pageIndex = 0;
          this.search();
        }
      });
    this.search();
  }

  getProvider(provider: ProviderItem): void {
    this.selectedProvider = provider;
    this.pageIndex = 0;
    this.search();
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.search();
  }

  toggleRow(element: AccountsPayableDuplicateItem): void {
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  hasPaidDocument(element: AccountsPayableDuplicateItem): boolean {
    return element.documents.some(doc => doc.paid);
  }

  getDocType(docType: string): string {
    if (docType === 'FACTURA') {
      return 'Electrónica'
    }
    if (docType === 'CAMBIARIA') {
      return 'Cambiaria electrónica'
    }
    if (docType === 'PEQUEÑO') {
      return 'Pequeño contribuyente'
    }
    if (docType === 'CREDITO') {
      return 'Nota de crédito'
    }
    if (docType === 'CREDITO_TEMP') {
      return 'Nota de crédito (Temp.)'
    }
  }

  search(): void {
    this.loading = true;
    this.expandedElement = null;
    this.accountsPayableService.getReportDuplicates(
      this.pageIndex,
      this.pageSize,
      this.range.controls['start'].value,
      this.range.controls['end'].value,
      this.selectedProvider?._id
    )
      .subscribe(data => {
        this.duplicates = data.duplicates;
        this.total = data.total;
        this.loading = false;
      });
  }

}
