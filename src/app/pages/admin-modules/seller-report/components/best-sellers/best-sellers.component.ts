import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';

import { CellarItem } from 'src/app/core/models/Cellar';
import { BestWorstSellers } from 'src/app/core/models/ReportSeller';
import { SellerReportService } from '../../../../../core/services/httpServices/seller-report.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { XlsxService } from '../../../../../core/services/internal/XlsxService.service';

@Component({
  selector: 'app-best-sellers',
  templateUrl: './best-sellers.component.html',
  styleUrls: ['./best-sellers.component.scss'],
})
export class BestSellersComponent
  implements OnInit, OnDestroy {
  loading = false;
  cellar: CellarItem;

  bestSellerSubscription: Subscription;
  bestSellers: BestWorstSellers[];


  form = new FormGroup({
    startDate: new FormControl(new Date(), Validators.required),
    endDate: new FormControl(new Date(), Validators.required),
  });

  dataSource = new MatTableDataSource();
  columnsToDisplay = ['barcode', 'description', 'brand', 'total'];
  expandedElement: BestWorstSellers | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    private sellerReportService: SellerReportService,
    private toastyService: ToastyService,
    private xlsxService: XlsxService
    ) {
    this.bestSellerSubscription = this.sellerReportService
      .readData()
      .subscribe((data) => {
        this.bestSellers = data;
        this.dataSource = new MatTableDataSource<BestWorstSellers>(
          this.bestSellers
        );
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.bestSellerSubscription.unsubscribe();
  }

  getCellar(cellar: CellarItem): void {
    this.cellar = cellar;
  }

  applyFilter(filter: string): void {
    this.dataSource.filter = filter;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  buttomLoadData(): void {
    this.loadData(this.form.value.startDate, this.form.value.endDate);
  }

  loadData(start, end): void {
    this.loading = true;
    this.bestSellers = undefined;
    const startDate = start._d ? start._d : start;
    const endDate = end._d ? end._d : end;
    if (this.cellar) {
      const startDate = start._d ? start._d : start;
      const endDate = end._d ? end._d : end;
      const FILTER = {
        startDate,
        endDate,
        _cellar: this.cellar._id,
      };
      this.sellerReportService.loadData(FILTER);
    }
    else {
      const FILTER = {
        startDate,
        endDate,
        _cellar: "",
      };
      this.sellerReportService.loadData(FILTER);
    }
  }

  downloadXlsx(): void {
    if (!this.bestSellers || this.bestSellers.length === 0) {
      this.toastyService.error('No hay datos para descargar, por favor realice una consulta');
      return;
    }
    const body = [
      [this.cellar ? this.cellar.name : 'Todos'],
      ['Código', 'Producto', 'Laboratorio', 'Total']
    ];

    const ArrayToPrint: any[] = [];

    this.bestSellers.forEach(item => {
      const row: any[] = [];

      this.columnsToDisplay.forEach(column => {
        row.push(item[column]);
      });

      ArrayToPrint.push(row);
    });

    ArrayToPrint.forEach((row) => body.push(row));

    this.xlsxService.downloadSinglePage(
      body,
      'Productos mas vendidos',
      this.cellar ? this.cellar.name : 'Todos'
    );
  }
}
