import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CellarItem } from 'src/app/core/models/Cellar';
import { BestWorstSellers } from 'src/app/core/models/ReportSeller';
import { SellerReportService } from 'src/app/core/services/httpServices/seller-report.service';

@Component({
  selector: 'app-worst-sellers',
  templateUrl: './worst-sellers.component.html',
  styleUrls: ['./worst-sellers.component.scss']
})
export class WorstSellersComponent implements OnInit, AfterContentInit, OnDestroy {
  loading = false;
  cellar: CellarItem;

  worstSellerSubscription: Subscription;
  worstSellers: BestWorstSellers[];


  form = new FormGroup({
    startDate: new FormControl(new Date(), Validators.required),
    endDate: new FormControl(new Date(), Validators.required),
  });

  dataSource = new MatTableDataSource();
  columnsToDisplay = ['code', 'barcode', 'description', 'brand', 'total'];
  expandedElement: BestWorstSellers | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private sellerReportService: SellerReportService) {
    this.worstSellerSubscription = this.sellerReportService
      .readWorstData()
      .subscribe((data) => {
        this.worstSellers = data;
        this.dataSource = new MatTableDataSource<BestWorstSellers>(
          this.worstSellers
        );
        this.dataSource.paginator = this.paginator;
        this.loading = false;
        console.log(this.worstSellers);
        console.log(this.loading);
      });
  }

  ngOnInit(): void {}

  ngAfterContentInit() {}

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
    console.log('Funciona malditasea!! --');
    this.loadData(this.form.value.startDate, this.form.value.endDate);
  }

  loadData(start, end): void {
    this.loading = true;
    console.log('loading');
    this.worstSellers = undefined;
    const startDate = start._d ? start._d : start;
    const endDate = end._d ? end._d : end;
    if (this.cellar) {
    console.log(this.cellar);
      const startDate = start._d ? start._d : start;
      const endDate = end._d ? end._d : end;
      const FILTER = {
        startDate,
        endDate,
        _cellar: this.cellar._id,
      };
      this.sellerReportService.loadWorstData(FILTER);
      console.log(this.loading);
    }
    else {
      const FILTER = {
        startDate,
        endDate,
        _cellar: "",
      };
      this.sellerReportService.loadWorstData(FILTER);
      console.log(this.loading);
    }
  }
}
