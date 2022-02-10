import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { CellarItem } from 'src/app/core/models/Cellar';
import { TempStorageItem } from 'src/app/core/models/TempStorage';
import { TimeFormatPipe } from 'src/app/core/shared/pipes/timePipes/time-format.pipe';
import { LoadStatisticsComponent } from '../../components/load-statistics/load-statistics.component';
import { BrandItem } from '../../../../../core/models/Brand';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { TempStorageService } from '../../../../../core/services/httpServices/temp-storage.service';
import { XlsxService } from '../../../../../core/services/internal/XlsxService.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  loading = false;
  currentCellar: CellarItem;

  form = new FormGroup({
    _brand: new FormControl(null, Validators.required),
    type: new FormControl(null)
  });

  tempData: TempStorageItem[] = [];
  dataSource = new MatTableDataSource();
  columns = [
    'barcode',
    'description',
    'stock',
    'lastUpdateStock',
    'supply',
    'minExistence',
    'maxExistence',
    'exceeds',
    'missing',
    'lastUpdateStatics',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private toastyService: ToastyService,
    private tempStorageService: TempStorageService,
    private xlsxService: XlsxService,
    public timeFormat: TimeFormatPipe,
  ) { }

  ngOnInit(): void {
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));

    this.form.valueChanges.subscribe(next => {
      this.getProducts();
    })
  }

  loadStatistics(): void {
    const dialogRef = this.dialog.open(LoadStatisticsComponent, {
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  getBrand(brand: BrandItem): void {
    if (!brand) {
      this.form.controls._brand.setValue(null);
      return
    }
    this.form.controls._brand.setValue(brand._id);
  }

  applyFilter(filter: string): void {
    this.dataSource.filter = filter;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getProducts(): void {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.tempStorageService.loadData(this.currentCellar._id, 1, 20, '', this.form.controls._brand.value)
      .subscribe((resp: any) => {
        this.tempData = resp;
        const TYPE: string = this.form.controls.type.value;
        if (TYPE) {
          if (TYPE === 'requests') {
            this.tempData = this.tempData.filter(t =>( t.supply &&  t.supply > 0))
          }
          if (TYPE === 'returns') {
            this.tempData = this.tempData.filter(t => (t.stock && t.maxStock && t.stock > t.maxStock))
          }
        }
        this.dataSource = new MatTableDataSource<TempStorageItem>(this.tempData);
        this.dataSource.paginator = this.paginator;
        /* #region  función para poder filtrar subdocumentos dentro de la tabla */
        this.dataSource.filterPredicate = (data: any, filter) => {
          const dataStr = data._product.barcode + data._product.description;
          return dataStr.trim().toLowerCase().indexOf(filter) != -1;
        }
        /* #endregion */
        this.loading = false;
      })
  }

  downloadXlsx(): void {
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

    if (this.tempData.length === 0) {
      this.toastyService.error('No hay información en la tabla para exportar');
      return;
    } else {
      this.tempData.forEach((item) => {
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
