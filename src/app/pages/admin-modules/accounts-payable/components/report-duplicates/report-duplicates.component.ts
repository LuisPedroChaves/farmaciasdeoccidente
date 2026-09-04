import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { debounceTime } from 'rxjs/operators';
import { AccountsPayableDuplicateItem } from 'src/app/core/models/AccountsPayable';
import { ProviderItem } from 'src/app/core/models/Provider';
import { AccountsPayableService } from 'src/app/core/services/httpServices/accounts-payable.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { XlsxService } from 'src/app/core/services/internal/XlsxService.service';
import { TimeFormatPipe } from 'src/app/core/shared/pipes/timePipes/time-format.pipe';

@Component({
  selector: 'app-report-duplicates',
  templateUrl: './report-duplicates.component.html',
  styleUrls: ['./report-duplicates.component.scss']
})
export class ReportDuplicatesComponent implements OnInit {

  loading = false;
  exporting = false;
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
    private toastyService: ToastyService,
    private timeFormat: TimeFormatPipe,
    private xlsxService: XlsxService,
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

  downloadXlsx(): void {
    if (this.total === 0) {
      this.toastyService.error('No hay información en la tabla para exportar');
      return;
    }

    this.exporting = true;
    this.accountsPayableService.getReportDuplicates(
      0,
      this.total,
      this.range.controls['start'].value,
      this.range.controls['end'].value,
      this.selectedProvider?._id
    )
      .subscribe(data => {
        const body = [
          [
            'NIT',
            'Proveedor',
            'Serie y número',
            'Repeticiones',
            'Última fecha',
            'Fecha documento',
            'Tipo',
            'Total (Q)',
            'Estado',
          ],
        ];

        const ArrayToPrint: any[] = [];

        (data.duplicates as AccountsPayableDuplicateItem[]).forEach((group) => {
          const LAST_DATE = group.lastDate ? this.timeFormat.transform(
            String(group.lastDate),
            'DD/MM/YYYY hh:mm',
            'es'
          ) : '';

          group.documents.forEach((doc) => {
            const DATE = doc.date ? this.timeFormat.transform(
              String(doc.date),
              'DD/MM/YYYY hh:mm',
              'es'
            ) : '';

            const row: any[] = [
              group._provider?.nit,
              group._provider?.name,
              `${group.serie} ${group.noBill}`,
              group.count,
              LAST_DATE,
              DATE,
              this.getDocType(doc.docType),
              doc.total.toFixed(2),
              doc.paid ? 'Pagado' : 'Pendiente',
            ];
            ArrayToPrint.push(row);
          });
        });

        ArrayToPrint.forEach((row) => body.push(row));

        this.xlsxService.downloadSinglePage(
          body,
          'Reporte de duplicados',
          'Reporte de duplicados'
        );
        this.exporting = false;
      });
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
