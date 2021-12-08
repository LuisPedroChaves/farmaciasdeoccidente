import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { AfterContentInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormControl } from '@angular/forms';

import { fromEvent, Observable, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  tap,
} from 'rxjs/operators';

import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { AppState } from 'src/app/core/store/app.reducer';
import { BrandItem } from 'src/app/core/models/Brand';
import { TempStorageService } from 'src/app/core/services/httpServices/temp-storage.service';
import { tempStorageDataSource } from '../../../../../core/services/cdks/tempStorages.datasource';
import { CellarItem } from '../../../../../core/models/Cellar';
import { BrandService } from 'src/app/core/services/httpServices/brand.service';
import { XlsxService } from '../../../../../core/services/internal/XlsxService.service';

@Component({
  selector: 'app-temp-storage',
  templateUrl: './temp-storage.component.html',
  styleUrls: ['./temp-storage.component.scss'],
})
export class TempStorageComponent
  implements OnInit, AfterViewInit, AfterContentInit, OnDestroy
{
  smallScreen = window.innerWidth < 960 ? true : false;
  currentCellar: CellarItem;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('search') search: ElementRef<HTMLInputElement>;

  dataSource: tempStorageDataSource;
  columns = [
    'barcode',
    'description',
    '_brand',
    'stock',
    'supply',
    'minExistence',
    'maxExistence',
    'exceeds',
    'missing',
    // 'options',
  ];
  currentPage = 0;

  brandsSubscription: Subscription;
  brands: BrandItem[];
  filteredBrands: Observable<BrandItem[]>;
  brand = new FormControl();

  constructor(
    public store: Store<AppState>,
    public tempStorageService: TempStorageService,
    public toasty: ToastyService,
    public router: Router,
    public dialog: MatDialog,
    public brandService: BrandService,
    public xlsxService: XlsxService
  ) {}

  ngOnInit(): void {
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));

    this.dataSource = new tempStorageDataSource(this.tempStorageService);
    this.dataSource.loadTempStorage(
      this.currentCellar._id,
      this.currentPage,
      10,
      '',
      ''
    );

    this.brandsSubscription = this.brandService.readData().subscribe((data) => {
      this.brands = data;
      // this.options = [...this.brands];
    });
    this.filteredBrands = this.brand.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterBrands(value))
    );
    console.log(this.dataSource);
  }

  ngAfterViewInit(): void {
    // server-side search
    fromEvent(this.search.nativeElement, 'keyup')
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadTempStorages();
        })
      )
      .subscribe();

    this.paginator.page.pipe(tap(() => this.loadTempStorages())).subscribe();
  }

  ngAfterContentInit(): void {
    this.brandService.loadData();
  }

  ngOnDestroy(): void {
    this.brandsSubscription?.unsubscribe();
  }

  loadTempStorages(): void {
    const BRAND = this.brand.value ? this.brand.value._id : '';

    this.dataSource.loadTempStorage(
      this.currentCellar._id,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.search.nativeElement.value,
      BRAND
    );
  }

  getShowName(brand: BrandItem): string {
    return brand ? brand.name : '';
  }

  private _filterBrands(value: string): BrandItem[] {
    if (value && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.brands.filter((option) =>
        option.name.toLowerCase().includes(filterValue)
      );
    } else {
      return [];
    }
  }

  clearBrand(): void {
    this.brand.setValue('');
    this.loadTempStorages();
  }

  downloadTempStorageXlsx(): void {
    const body = [
      [this.currentCellar.name, this.currentCellar.description],
      [
        'Codigo de Barras',
        'Descripción',
        'Laboratorio',
        'Inventario',
        'Abastecimiento',
        'Existencia Mínima',
        'Existencia Máxima',
        'Sobrantes',
        'Faltantes',
      ],
    ];

    const ArrayToPrint: any[] = [];

    if (this.dataSource.tempStorageSubject.value.length === 0) {
      this.toasty.error('No hay información en la tabla para exportar');
      return;
    } else {
      console.log(this.dataSource.tempStorageSubject.value);
      this.dataSource.tempStorageSubject.value.forEach((item) => {
        let exceeds: number | string = 0;
        let missing: number | string = 0;
        if (item.maxStock) {
          if (item.stock > item.maxStock) {
            exceeds = item.stock - item.maxStock;
          } else if (item.stock <= item.maxStock) {
            exceeds = 0;
          }
        } else {
          exceeds = 'Sin Registro';
        }
        if (item.minStock) {
          if (item.stock < item.minStock) {
            missing = item.minStock - item.stock;
          } else if (item.stock >= item.minStock) {
            missing = 0;
          }
        } else {
          missing = 'Sin Registro';
        }

        const row: any[] = [
          item._product.barcode,
          item._product.description,
          item._product._brand.name,
          item.stock,
          item.supply,
          item.minStock,
          item.maxStock,
          exceeds,
          missing,
        ];
        ArrayToPrint.push(row);
      });
    }

    ArrayToPrint.forEach((row) => body.push(row));

    this.xlsxService.downloadSinglePage(
      body,
      'Inventario Temporal',
      this.currentCellar.name
    );
  }
}
