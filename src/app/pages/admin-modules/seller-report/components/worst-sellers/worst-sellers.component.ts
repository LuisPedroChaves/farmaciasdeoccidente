import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';

import { CellarItem } from 'src/app/core/models/Cellar';
import { BestWorstSellers } from 'src/app/core/models/ReportSeller';
import { SellerReportService } from 'src/app/core/services/httpServices/seller-report.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { XlsxService } from '../../../../../core/services/internal/XlsxService.service';

@Component({
  selector: 'app-worst-sellers',
  templateUrl: './worst-sellers.component.html',
  styleUrls: ['./worst-sellers.component.scss']
})
export class WorstSellersComponent implements OnInit, OnDestroy {
  loading = false;
  cellar: CellarItem;

  worstSellerSubscription: Subscription;
  worstSellers: BestWorstSellers[];


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
    this.worstSellerSubscription = this.sellerReportService
      .readWorstData()
      .subscribe((data) => {
        this.worstSellers = data;
        this.dataSource = new MatTableDataSource<BestWorstSellers>(
          this.worstSellers
        );
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.worstSellerSubscription.unsubscribe();
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
    this.worstSellers = undefined;
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
      this.sellerReportService.loadWorstData(FILTER);
    }
    else {
      const FILTER = {
        startDate,
        endDate,
        _cellar: "",
      };
      this.sellerReportService.loadWorstData(FILTER);
    }
  }

  downloadXlsx(): void {
    if (!this.worstSellers || this.worstSellers.length === 0) {
      this.toastyService.error('No hay datos para descargar, por favor realice una consulta');
      return;
    }
    const body = [
      [this.cellar ? this.cellar.name : 'Todos'],
      ['Código', 'Producto', 'Laboratorio', 'Total']
    ];

    const ArrayToPrint: any[] = [];

    this.worstSellers.forEach(item => {
      const row: any[] = [];

      this.columnsToDisplay.forEach(column => {
        row.push(item[column]);
      });

      ArrayToPrint.push(row);
    });

    ArrayToPrint.forEach((row) => body.push(row));

    this.xlsxService.downloadSinglePage(
      body,
      'Productos menos vendidos',
      this.cellar ? this.cellar.name : 'Todos'
    );
  }
}
