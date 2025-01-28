import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime } from 'rxjs/operators';
import { CheckItem } from 'src/app/core/models/Check';
import { CheckService } from 'src/app/core/services/httpServices/check.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { XlsxService } from 'src/app/core/services/internal/XlsxService.service';
import { TimeFormatPipe } from 'src/app/core/shared/pipes/timePipes/time-format.pipe';

@Component({
  selector: 'app-report-checks',
  templateUrl: './report-checks.component.html',
  styleUrls: ['./report-checks.component.scss'],
})
export class ReportChecksComponent implements OnInit {
  loading = false;
  range = new FormGroup({
    start: new FormControl('', Validators.required),
    end: new FormControl('', Validators.required),
  });
  type = new FormControl('date');
  checks: CheckItem[] = [];
  dataSource = new MatTableDataSource();
  columns = ['date', 'paymentDate', 'no', 'name', 'amount', 'state'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private checkService: CheckService,
    private toastyService: ToastyService,
    private timeFormat: TimeFormatPipe,
    private xlsxService: XlsxService
  ) {}

  ngOnInit(): void {
    this.range.valueChanges.pipe(debounceTime(500)).subscribe((range) => {
      if (range.start && range.end) {
        this.search();
      }
    });
    this.type.valueChanges.subscribe(() => {
      this.search();
    });
  }

  applyFilter(filter: string): void {
    this.dataSource.filter = filter;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  search(): void {
    if (this.range.invalid) {
      return;
    }

    this.loading = true;
    this.checkService
      .getReport(
        this.range.controls['start'].value,
        this.range.controls['end'].value,
        this.type.value
      )
      .subscribe((data) => {
        this.checks = data;
        this.dataSource = new MatTableDataSource<CheckItem>(this.checks);
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      });
  }

  downloadXlsx(): void {
    if (this.checks.length === 0) {
      this.toastyService.error('No hay información en la tabla para exportar');
      return;
    }

    const body = [
      ['REPORTE DE CHEQUES'],
      [],
      [
        'Fecha de emisión',
        'Fecha de cobro',
        'No. Cheque',
        'Proveedor',
        'Monto',
        'Estado',
      ],
    ];

    const ArrayToPrint: any[] = [];

    this.checks.forEach((item) => {
      const DATE = item.created
        ? this.timeFormat.transform(
            String(item.created),
            'DD/MM/YYYY hh:mm',
            'es'
          )
        : '';

      const PAYMENT_DATE = item.date
        ? this.timeFormat.transform(String(item.date), 'DD/MM/YYYY hh:mm', 'es')
        : '';

      const row: any[] = [
        DATE,
        PAYMENT_DATE,
        item.no,
        item.name,
        item.amount.toFixed(2),
        item.state,
      ];
      ArrayToPrint.push(row);
    });

    ArrayToPrint.forEach((row) => body.push(row));

    this.xlsxService.downloadSinglePage(
      body,
      'Reporte de Cheques',
      'Reporte de Cheques'
    );
  }
}
