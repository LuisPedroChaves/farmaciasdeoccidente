import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventBusService } from '../../../../../core/services/internal/event-bus.service';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerItem } from 'src/app/core/models/Customer';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/core/services/httpServices/customer.service';
import { element } from 'protractor';
import { XlsxService } from 'src/app/core/services/internal/XlsxService.service';
@Component({
  selector: 'app-receivables',
  templateUrl: './receivables.component.html',
  styleUrls: ['./receivables.component.scss'],
})
export class ReceivablesComponent implements OnInit {
  smallScreen = window.innerWidth < 960 ? true : false;
  loading = false;

  sessionsubscription: Subscription;

  recivables: CustomerItem[];

  dataSource = new MatTableDataSource();
  columnsToDisplay = [
    'code',
    'nit',
    'name',
    'company',
    'phone',
    'address',
    'town',
    'department',
    '_seller',
    'limitDaysCredit',
    'limitCredit',
    'state',
    'balance',
  ];
  columnsToDisplay2 = [
    'image',
    'code',
    'nit',
    'name',
    'company',
    'phone',
    'address',
    'town',
    'department',
    '_seller',
    'limitDaysCredit',
    'limitCredit',
    'state',
    'balance',
  ];
  expandedElement: CustomerItem | null;

  constructor(
    public eventBus: EventBusService,
    public config: ConfigService,
    public dialog: MatDialog,
    public router: Router,
    public customerService: CustomerService,
    private xlsxService: XlsxService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.customerService.getRecivables().subscribe((data) => {
      this.recivables = data.customers;
      this.recivables = this.recivables.sort(this.sortDesc);
      this.dataSource = new MatTableDataSource(this.recivables);
      // this.downloadXlsx(this.recivables);
      this.loading = false;
    });
  }

  selectCustomer(customer: CustomerItem) {
    this.router.navigate([
      '/admin/statements',
      customer._id,
      '/admin/receivables',
    ]);
  }

  sortDesc(a, b) {
    return parseFloat(a.balance) > parseFloat(b.balance)
      ? -1
      : parseFloat(b.balance) > parseFloat(a.balance)
      ? 1
      : 0;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  downloadXlsx(cuentas: CustomerItem[]): void {
    const body = [
      ['CUENTAS POR COBRAR'],
      [],
      [
        'Código',
        'NIT',
        'Nombre',
        'Empresa',
        'Vendedor',
        'Días de crédito',
        'Limite de Crédito',
        'Saldo',
      ],
    ];

    const ArrayToPrint: any[] = [];

    cuentas.forEach((item) => {
      const row: any[] = [
        item.code,
        item.nit,
        item.name,
        item.company,
        item._seller.name,
        item.limitDaysCredit,
        item.limitCredit.toFixed(2),
        item.balance,
      ];
      ArrayToPrint.push(row);
    });

    ArrayToPrint.forEach((row) => body.push(row));

    this.xlsxService.downloadSinglePage(
      body,
      'Reporte de cuentas por cobrar',
      'Reporte de cuentas por cobrar'
    );
  }
}
