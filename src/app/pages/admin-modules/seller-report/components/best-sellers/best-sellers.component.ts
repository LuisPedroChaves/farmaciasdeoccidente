import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CellarItem } from 'src/app/core/models/Cellar';
import { BestWorstSellers } from 'src/app/core/models/ReportSeller';
import { SellerReportService } from '../../../../../core/services/httpServices/seller-report.service';

@Component({
  selector: 'app-best-sellers',
  templateUrl: './best-sellers.component.html',
  styleUrls: ['./best-sellers.component.scss'],
})
export class BestSellersComponent implements OnInit {
  loading = false;
  cellar: CellarItem;

  bestSellerSubscription: Subscription;
  bestSellers: BestWorstSellers[];

  currentCellar = '';

  form = new FormGroup({
    startDate: new FormControl(new Date(), Validators.required),
    endDate: new FormControl(new Date(), Validators.required),
  });

  dataSource = new MatTableDataSource();

  expandedElement: BestWorstSellers | null;

  constructor(private sellerReportService: SellerReportService) {}

  ngOnInit(): void {
    this.form.valueChanges
    .pipe(
      debounceTime(500),
    )
    .subscribe(range => {
      console.log(range);
      if (range.startDate && range.endDate) {
        console.log('Hola');
        this.loadData(range.startDate, range.endDate);
      }
    });
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

  loadData(start, end): void {
    this.bestSellers = undefined;
    const startDate = start._d ? start._d : start;
    const endDate = end._d ? end._d : end;
    const FILTER = {
      startDate,
      endDate,
      _cellar: this.currentCellar,
    };
    this.sellerReportService.loadData(FILTER);
  }
}
