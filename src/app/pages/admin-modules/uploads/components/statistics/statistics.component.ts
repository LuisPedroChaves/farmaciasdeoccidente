import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BrandItem } from 'src/app/core/models/Brand';
import { CellarItem } from 'src/app/core/models/Cellar';
import { BrandService } from 'src/app/core/services/httpServices/brand.service';
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
  implements OnInit, AfterContentInit, OnDestroy {
  smallScreen = window.innerWidth < 960 ? true : false;
  loading = false;
  loadSalesComplete = false;
  cellarsSubscription: Subscription;
  cellars: CellarItem[];
  errores2: any[];

  currentCellar2: string;
  currentDate: Date;

  orderFind = false;
  brandsSubscription: Subscription;
  brands: BrandItem[];
  options: BrandItem[] = [];
  filteredOptions: Observable<BrandItem[]>;

  range = new FormGroup({
    startDate: new FormControl(new Date()),
    endDate: new FormControl(new Date()),
    startDate2: new FormControl(new Date()),
    endDate2: new FormControl(new Date()),
    _brand: new FormControl(),
  });

  daysOfRequest = '';
  supplyDays = '';
  loadingData = false;
  setData = false;
  isEmpty = false;

  // Table
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource: any;
  columns = [
    'barcode',
    'description',
    'avgSalesMonths',
    'avgSalesYear',
    'salesLastMonth',
    'avgSalesMonth',
    'avgSalesDay',
    'inventory',
    'suggestedOrder',
    'stockCellar',
    'minExistence',
    'maxExistence',
  ];
  currentPage = 0;
  // End Table

  constructor(
    public cellarService: CellarService,
    public tempStorageService: TempStorageService,
    public tempSaleService: TempSaleService,
    public brandService: BrandService,
    private toastyService: ToastyService
  ) {
    this.cellarsSubscription = this.cellarService
      .readData()
      .subscribe((data) => {
        this.cellars = data;
      });
  }

  ngOnInit(): void {
    this.brandsSubscription = this.brandService.readData().subscribe((data) => {
      this.brands = data;
      this.options = [...this.brands];
    });
    this.filteredOptions = this.range.controls._brand.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterBrands(value))
    );
  }

  ngAfterContentInit(): void {
    this.brandService.loadData();
    this.cellarService.loadData();
  }
  ngOnDestroy(): void {
    this.brandsSubscription?.unsubscribe();
    this.cellarsSubscription.unsubscribe();
  }


  private _filterBrands(value: string): BrandItem[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.options.filter((option) =>
        option.name.toLowerCase().includes(filterValue)
      );
    } else {
      return [];
    }
  }

  loadSettings(): void {
    if (!this.currentCellar2) {
      this.toastyService.error('Debe seleccionar una sucursal');
      return;
    }
    if (this.daysOfRequest === '' || this.supplyDays === '') {
      this.toastyService.error('Llene los campos solicitados');
      return;
    }
    const brand = this.brands.find(
      (e) => e.name === this.range.controls._brand.value
    );
    this.loadingData = true;
    this.setData = true;
    let selectedBrand = 'null';
    if (brand) {
      selectedBrand = brand._id;
    }
    this.tempSaleService
      .getStatics(
        this.currentCellar2,
        selectedBrand,
        this.range.controls.startDate.value,
        this.range.get('endDate').value,
        this.range.controls.startDate2.value,
        this.range.get('endDate2').value,
        this.daysOfRequest,
        this.supplyDays
      )
      .subscribe((res) => {
        const response = res;
        this.dataSource = new MatTableDataSource<any>(response.tempSales);
        if (response.tempSales.length === 0) {
          this.isEmpty = true;
        } else {
          this.isEmpty = false;
        }
        this.dataSource.paginator = this.paginator;
        this.loadingData = false;
      });
  }

  getDate(date: any): string {
    return date._d;
  }
}
