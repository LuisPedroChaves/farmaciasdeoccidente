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
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent
  implements OnInit, AfterContentInit, OnDestroy, AfterViewInit {
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
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource();
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
    private toastyService: ToastyService,
    private dialog: MatDialog
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

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
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
    if (brand) {
      this.loadingData = true;
      this.setData = true;
      this.tempSaleService
        .getStatics(
          this.currentCellar2,
          brand._id,
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
          /* #region  función para poder filtrar subdocumentos dentro de la tabla */
          this.dataSource.filterPredicate = (data: any, filter) => {
            const dataStr = data._id.barcode + data._id.description;
            return dataStr.trim().toLowerCase().indexOf(filter) != -1;
          }
          /* #endregion */
          /* #region función para poder ordenar subdocumentos dentro de la tabla */
          this.dataSource.sortingDataAccessor = (item: any, property) => {
            switch (property) {
              case 'barcode': return item._id.barcode;
              case 'description': return item._id.description;
              // case 'avgSalesMonths': return item.promMonth;
              // case 'avgSalesYear': return item.promDays;
              // case 'salesLastMonth': return item.salesMonth;
              // case 'avgSalesMonth': return item.promAdjustMonth;
              // case 'avgSalesDay': return item.promAdjustDay;
              // case 'inventory': return item.stock;
              // case 'suggestedOrder': return item.request;
              // case 'stockCellar': return item.stockCellar;
              // case 'minExistence': return item.minStock;
              // case 'maxExistence': return item.maxStock;
              default: return item[property];
            }
          };
          this.dataSource.sort = this.sort;
          /* #endregion */
          if (response.tempSales.length === 0) {
            this.isEmpty = true;
          } else {
            this.isEmpty = false;
          }
          // this.dataSource.paginator = this.paginator;
          this.loadingData = false;
        });
    } else {
      this.toastyService.error('Por favor seleccione un laboratorio');
    }
  }

  getDate(date: any): string {
    return date._d;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateTempStorage(): void {
    if (!this.dataSource || this.dataSource.filteredData.length === 0) {
      this.toastyService.error('No hay cálculos generados');
      return;
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'INGRESAR A INVENTARIO',
        message:
          '¿Confirma que desea actualizar las estadisticas en la sucursal seleccionada?',
      },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.loading = true;
        this.tempStorageService.update(this.dataSource.filteredData).subscribe(resp => {
          this.toastyService.success('Inventario actualizado correctamente');
          this.loading = false;
        });
      }
    });
  }
}
