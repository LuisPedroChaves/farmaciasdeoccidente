import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormControl } from '@angular/forms';

import { fromEvent } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  pairwise,
  startWith,
  tap,
} from 'rxjs/operators';

import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { AppState } from 'src/app/core/store/app.reducer';
import { BrandItem } from 'src/app/core/models/Brand';
import { TempStorageService } from 'src/app/core/services/httpServices/temp-storage.service';
import { TimeFormatPipe } from 'src/app/core/shared/pipes/timePipes/time-format.pipe';
import { TempStorageItem } from 'src/app/core/models/TempStorage';
import { tempStorageDataSource } from '../../../../../core/services/cdks/tempStorages.datasource';
import { CellarItem } from '../../../../../core/models/Cellar';
import { XlsxService } from '../../../../../core/services/internal/XlsxService.service';

@Component({
  selector: 'app-temp-storage',
  templateUrl: './temp-storage.component.html',
  styleUrls: ['./temp-storage.component.scss'],
})
export class TempStorageComponent
  implements OnInit, AfterViewInit {
  smallScreen = window.innerWidth < 960 ? true : false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('search') search: ElementRef<HTMLInputElement>;

  currentCellar: CellarItem;
  brand: BrandItem;
  type = new FormControl('all');

  tempData: TempStorageItem[] = [];
  dataSource: tempStorageDataSource;
  columns = [
    'barcode',
    'description',
    '_brand',
    'stock',
    'lastUpdateStock',
    'supply',
    'minExistence',
    'maxExistence',
    'exceeds',
    'missing',
    'lastUpdateStatics',
    // 'options',
  ];
  currentPage = 0;

  constructor(
    public store: Store<AppState>,
    public tempStorageService: TempStorageService,
    public toasty: ToastyService,
    public router: Router,
    public dialog: MatDialog,
    public xlsxService: XlsxService,
    public timeFormat: TimeFormatPipe,
  ) { }

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

    // Escuchamos el filtro de tipo para filtar el dataSource con los valores seleccionados PEDIDOS SUGERIDOS | DEVOLUCIONES
    // PIPE'S
    // startWith: Cuando se inicia el componente el valor de PREV no existe entonces lo seteamos como un NULL de tipo string
    // pairwise: Agrupa el valor actual y el valor anterior como un array, y lo emite.
    this.type.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(([prev, value]) => {

      const TYPE_OPTIONS = {
        'all': () => this.dataSource.tempStorageSubject.next(this.tempData),
        'requests': () => {
          if (!prev || prev === 'all') {
            // Si anteroirmente estaba cargada toda la data entonces la asignamos a tempData antes de filtrarlos para no perder todos los datos
            this.tempData = this.dataSource.tempStorageSubject.value;
            this.dataSource.tempStorageSubject.next(this.tempData.filter(t => t.supply > 0))
          }else {
            // Solo filtramos los datos previamente asignados a tempData
            this.dataSource.tempStorageSubject.next(this.tempData.filter(t => t.supply > 0))
          }
        },
        'returns': () =>{
          if (!prev || prev === 'all') {
            // Si anteroirmente estaba cargada toda la data entonces la asignamos a tempData antes de filtrarlos para no perder todos los datos
            this.tempData = this.dataSource.tempStorageSubject.value;
            this.dataSource.tempStorageSubject.next(this.tempData.filter(t => t.stock > t.maxStock))
          }else {
            // Solo filtramos los datos previamente asignados a tempData
            this.dataSource.tempStorageSubject.next(this.tempData.filter(t => t.stock > t.maxStock))
          }
        }
      }
      TYPE_OPTIONS[value]();
    })
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

  getBrand(brand: BrandItem) {
    this.brand = brand;
    this.loadTempStorages();
  }


  loadTempStorages(): void {
    const BRAND = this.brand ? this.brand._id : '';

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

  downloadTempStorageXlsx(): void {
    const body = [
      [this.currentCellar.name, this.currentCellar.description],
      [
        'Codigo de Barras',
        'Descripción',
        'Laboratorio',
        'Inventario',
        'Último ingreso',
        'Pedido sugerido',
        'Existencia Mínima',
        'Existencia Máxima',
        'Devoluciones',
        'Faltantes',
        'Última estadística'
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
          exceeds = 0;
        }
        if (item.minStock) {
          if (item.stock < item.minStock) {
            missing = item.minStock - item.stock;
          } else if (item.stock >= item.minStock) {
            missing = 0;
          }
        } else {
          missing = 0;
        }

        const LAST_UPDATE_STOCK = item.lastUpdateStock ? this.timeFormat.transform(
          String(item.lastUpdateStock),
          'DD/MM/YYYY hh:mm',
          'es'
        ) : '';

        const LAST_UPDATE_STATICS = item.lastUpdateStatics ? this.timeFormat.transform(
          String(item.lastUpdateStatics),
          'DD/MM/YYYY hh:mm',
          'es'
        ) : '';

        const row: any[] = [
          item._product.barcode,
          item._product.description,
          item._product._brand.name,
          item.stock,
          LAST_UPDATE_STOCK,
          item.supply,
          item.minStock ? item.minStock : 0,
          item.maxStock ? item.maxStock : 0,
          exceeds,
          missing,
          LAST_UPDATE_STATICS
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
