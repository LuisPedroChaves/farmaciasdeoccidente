import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { debounceTime } from 'rxjs/operators';
import { AccountsPayableItem } from 'src/app/core/models/AccountsPayable';
import { ProviderItem } from 'src/app/core/models/Provider';
import { AccountsPayableService } from 'src/app/core/services/httpServices/accounts-payable.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { XlsxService } from 'src/app/core/services/internal/XlsxService.service';
import { TimeFormatPipe } from 'src/app/core/shared/pipes/timePipes/time-format.pipe';

@Component({
  selector: 'app-report-provider',
  templateUrl: './report-provider.component.html',
  styleUrls: ['./report-provider.component.scss']
})
export class ReportProviderComponent implements OnInit {

  loading = false;
  selectedProvider: ProviderItem;
  range = new FormGroup({
    start: new FormControl('', Validators.required),
    end: new FormControl('', Validators.required)
  });
  accountsPayables: AccountsPayableItem[] = [];
  dataSource = new MatTableDataSource();
  columns = [
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
    'additionalDiscount',
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

  getProvider(provider: ProviderItem) {
    this.selectedProvider = provider;
    this.search();
  }

  getTotalPurchase(): number {
    const BILLS: AccountsPayableItem[] = this.accountsPayables.filter(a => (a.docType === 'FACTURA' || a.docType === 'CAMBIARIA' || a.docType === 'PEQUEÑO'));
    return BILLS.reduce((sum, item) => sum += item.total, 0)
  }

  getTotalPay(): number {
    return this.accountsPayables.reduce((sum, item) => {
      if (item.docType === 'FACTURA' || item.docType === 'CAMBIARIA' || item.docType === 'PEQUEÑO') {
        // Obtenemos el total de retenciones
        const TOTAL_WITHHOLDING = item.balance.reduce((sum, item) => {
          if (item.credit === 'RETENCION_IVA' || item.credit === 'RETENCION_ISR') {
            sum += item.amount;
          } else {
            sum += 0;
          }
          return sum;
        }, 0)
        sum += +item.total - +TOTAL_WITHHOLDING;
      } else {
        sum -= item.total;
      }
      return sum;
    }, 0)
  }

  getExpired(expirationCredit: Date): boolean {
    return new Date(expirationCredit) < new Date()
  }

  search(): void {
    if (!this.selectedProvider) {
      return
    }
    if (this.range.invalid) {
      return
    }

    this.loading = true;
    this.accountsPayableService.getReportProvider(this.range.controls['start'].value, this.range.controls['end'].value, this.selectedProvider._id)
      .subscribe(data => {
        this.accountsPayables = data;
        this.dataSource = new MatTableDataSource<AccountsPayableItem>(this.accountsPayables);
        this.dataSource.paginator = this.paginator;
        /* #region  función para poder filtrar subdocumentos dentro de la tabla */
        this.dataSource.filterPredicate = (data: any, filter) => {
          const dataStr = data._user.name;
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
      ['PROVEEDOR', 'TOTAL COMPRADO', 'TOTAL PAGADO'],
      [`${this.selectedProvider.nit} - ${this.selectedProvider.name}`, this.getTotalPurchase().toFixed(2), this.getTotalPay().toFixed(2)],
      [
        'Fecha',
        'Serie y número',
        'Tipo',
        'No Afecto',
        'Exentos',
        'Compras Neto',
        'Servicios Neto',
        'Otros Impuestos',
        'I.V.A. Crédito Fiscal',
        'Total (Q)',
        'Fecha de vencimiento',
        'dto. Adicional',
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
        DATE,
        `${item.serie} ${item.noBill}`,
        this.getDocType(item.docType),
        item.unaffectedAmount.toFixed(2),
        item.exemptAmount.toFixed(2),
        item.netPurchaseAmount.toFixed(2),
        item.netServiceAmount.toFixed(2),
        item.otherTaxes.toFixed(2),
        item.iva.toFixed(2),
        item.total.toFixed(2),
        EXPIRATION_DATE,
        item.additionalDiscount ? 'SI' : 'NO',
        item._user.name
      ];
      ArrayToPrint.push(row);
    });

    ArrayToPrint.forEach((row) => body.push(row));

    this.xlsxService.downloadSinglePage(
      body,
      'Reporte de proveedores',
      this.selectedProvider.name
    );
  }

}
