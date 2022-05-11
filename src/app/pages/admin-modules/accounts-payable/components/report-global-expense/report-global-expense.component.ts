import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime } from 'rxjs/operators';

import { AccountsPayableItem } from 'src/app/core/models/AccountsPayable';
import { AccountsPayableService } from 'src/app/core/services/httpServices/accounts-payable.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { XlsxService } from 'src/app/core/services/internal/XlsxService.service';
import { TimeFormatPipe } from 'src/app/core/shared/pipes/timePipes/time-format.pipe';

@Component({
  selector: 'app-report-global-expense',
  templateUrl: './report-global-expense.component.html',
  styleUrls: ['./report-global-expense.component.scss']
})
export class ReportGlobalExpenseComponent implements OnInit {

  loading = false;
  range = new FormGroup({
    start: new FormControl('', Validators.required),
    end: new FormControl('', Validators.required)
  });
  accountsPayables: AccountsPayableItem[] = [];
  dataSource = new MatTableDataSource();
  columns = [
    '_expense',
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
    '_user'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private accountsPayableService: AccountsPayableService,
    private toastyService: ToastyService,
    private timeFormat: TimeFormatPipe,
    private xlsxService: XlsxService
  ) { }

  ngOnInit(): void {
    this.range.valueChanges
    .pipe(
      debounceTime(500),
    )
    .subscribe(range => {
      if (range.start && range.end) {
        this.search();
      }
    });
  }

  applyFilter(filter: string): void {
    this.dataSource.filter = filter;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getExpired(expirationCredit: Date): boolean {
    return new Date(expirationCredit) < new Date()
  }

  search(): void {
    if (this.range.invalid) {
      return
    }

    this.loading = true;
    this.accountsPayableService.getReportExpenses(this.range.controls['start'].value, this.range.controls['end'].value)
      .subscribe(data => {
        this.accountsPayables = data;
        this.dataSource = new MatTableDataSource<AccountsPayableItem>(this.accountsPayables);
        this.dataSource.paginator = this.paginator;
        /* #region  función para poder filtrar subdocumentos dentro de la tabla */
        this.dataSource.filterPredicate = (data: any, filter) => {
          const dataStr = data._user.name + data._expense.name + data._provider.name;
          return dataStr.trim().toLowerCase().indexOf(filter) != -1;
        }
        /* #endregion */
        this.loading = false;
      })
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
    if (docType === 'ABONO') {
      return 'Nota de abono'
    }
    if (docType === 'CREDITO') {
      return 'Nota de crédito'
    }
    if (docType === 'CREDITO_TEMP') {
      return 'Nota de crédito (Temp.)'
    }
  }

  downloadXlsx(): void {
    if (this.accountsPayables.length === 0) {
      this.toastyService.error('No hay información en la tabla para exportar');
      return;
    }

    const body = [
      ['REPORTE DE GASTOS'],
      [],
      [
        'Gasto',
        'Fecha',
        'Serie y número',
        'Tipo',
        'Proveedor',
        'No Afecto',
        'Exentos',
        'Compras Neto',
        'Servicios Neto',
        'Otros Impuestos',
        'I.V.A. Crédito Fiscal',
        'Total (Q)',
        'Fecha de vencimiento',
        'Usuario'
      ],
    ];

    const ArrayToPrint: any[] = [];

    this.accountsPayables.forEach((item) => {


      const DATE = item.date ? this.timeFormat.transform(
        String(item.date),
        'DD/MM/YYYY hh:mm',
        'es'
      ) : '';

      const EXPIRATION_DATE = item.expirationCredit ? this.timeFormat.transform(
        String(item.expirationCredit),
        'DD/MM/YYYY hh:mm',
        'es'
      ) : '';

      const row: any[] = [
        item._expense.name,
        DATE,
        `${item.serie} ${item.noBill}`,
        this.getDocType(item.docType),
        item._provider.name,
        item.unaffectedAmount.toFixed(2),
        item.exemptAmount.toFixed(2),
        item.netPurchaseAmount.toFixed(2),
        item.netServiceAmount.toFixed(2),
        item.otherTaxes.toFixed(2),
        item.iva.toFixed(2),
        item.total.toFixed(2),
        EXPIRATION_DATE,
        item._user.name
      ];
      ArrayToPrint.push(row);
    });

    ArrayToPrint.forEach((row) => body.push(row));

    this.xlsxService.downloadSinglePage(
      body,
      'Reporte de Gastos',
      'Reporte de Gastos'
    );
  }

}
