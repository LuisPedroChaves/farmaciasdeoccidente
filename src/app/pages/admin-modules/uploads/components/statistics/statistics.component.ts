import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CellarItem } from 'src/app/core/models/Cellar';
import { CellarService } from 'src/app/core/services/httpServices/cellar.service';
import { TempSaleService } from 'src/app/core/services/httpServices/temp-sale.service';
import { TempStorageService } from 'src/app/core/services/httpServices/temp-storage.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  smallScreen = window.innerWidth < 960 ? true : false;
  loading = false;
  loadSalesComplete = false;
  cellarsSubscription: Subscription;
  cellars: CellarItem[];
  errores2: any[];

  currentCellar2: string;
  currentDate: Date;

  range = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });

  constructor(
    public cellarService: CellarService,
    private toastyService: ToastyService,
    public tempStorageService: TempStorageService,
    public tempSaleService: TempSaleService
  ) {
    this.cellarsSubscription = this.cellarService
      .readData()
      .subscribe((data) => {
        this.cellars = data;
      });
  }

  ngOnInit(): void {}

  ngAfterContentInit(): void {
    this.cellarService.loadData();
  }
  ngOnDestroy(): void {
    this.cellarsSubscription.unsubscribe();
  }

  loadSale(): void {
    this.loadSalesComplete = true;
  }
}
