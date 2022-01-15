import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { BrandItem } from 'src/app/core/models/Brand';
import { CellarItem } from 'src/app/core/models/Cellar';
import { CellarService } from '../../../../../core/services/httpServices/cellar.service';
import { BrandService } from '../../../../../core/services/httpServices/brand.service';
import { map, startWith } from 'rxjs/operators';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { TempSaleService } from '../../../../../core/services/httpServices/temp-sale.service';
import { TimeFormatPipe } from 'src/app/core/shared/pipes/timePipes/time-format.pipe';
import { XlsxService } from '../../../../../core/services/internal/XlsxService.service';

@Component({
  selector: 'app-temp-statistics',
  templateUrl: './temp-statistics.component.html',
  styleUrls: ['./temp-statistics.component.scss']
})
export class TempStatisticsComponent implements OnInit, AfterContentInit, OnDestroy {

  smallScreen = window.innerWidth < 960 ? true : false;
  loading = false;

  cellarsSubscription: Subscription;
  cellars: CellarItem[];
  currentCellar2: string;

  brandsSubscription: Subscription;
  brands: BrandItem[];
  options: BrandItem[] = [];
  filteredOptions: Observable<BrandItem[]>;

  range = new FormGroup({
    startDate: new FormControl(new Date()),
    endDate: new FormControl(new Date()),
    _brand: new FormControl(),
  });

  products: any[];
  dataSource = new MatTableDataSource();
  columnsToDisplay = [
    'barcode',
    'description',
    'sales',
    'inventory',
    'lastUpdateStock'
  ];

  constructor(
    public cellarService: CellarService,
    public brandService: BrandService,
    public toastyService: ToastyService,
    public tempSaleService: TempSaleService,
    public timeFormat: TimeFormatPipe,
    public xlsxService: XlsxService
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
    const brand = this.brands.find(
      (e) => e.name === this.range.controls._brand.value
    );
    if (brand) {
      this.loading = true;
      this.tempSaleService
        .getTempStatics(
          this.currentCellar2,
          brand._id,
          this.range.controls.startDate.value,
          this.range.controls.endDate.value,
        )
        .subscribe((res) => {
          const response = res;
          this.products = response.products;
          this.dataSource = new MatTableDataSource<any>(this.products);
          this.loading = false;
        });
    } else {
      this.toastyService.error('Por favor seleccione un laboratorio');
    }
  }


  downloadXlsx() {
    if (this.products.length === 0) {
      this.toastyService.error('No hay información en la tabla para exportar');
      return;
    }
    const CELLAR = this.cellars.find(c => c._id === this.currentCellar2);
    const brand = this.brands.find(
      (e) => e.name === this.range.controls._brand.value
    );
    const body = [
      [CELLAR.name, brand.name],
      [
        'Codigo de Barras',
        'Descripción',
        'Ventas',
        'Inventario',
        'Último ingreso',
      ],
    ];

    const ArrayToPrint: any[] = [];


    this.products.forEach((item) => {

      const LAST_UPDATE_STOCK = item.lastUpdateStock ? this.timeFormat.transform(
        String(item.lastUpdateStock),
        'DD/MM/YYYY hh:mm',
        'es'
      ) : '';

      const row: any[] = [
        item.barcode,
        item.description,
        item.sales,
        item.stock,
        LAST_UPDATE_STOCK,
      ];
      ArrayToPrint.push(row);
    });

    ArrayToPrint.forEach((row) => body.push(row));

    this.xlsxService.downloadSinglePage(
      body,
      'Estadisticas Temporal',
      `${CELLAR.name} - ${brand.name}`
    );
  }

}
