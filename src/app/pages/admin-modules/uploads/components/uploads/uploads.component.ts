import { Component, OnInit, AfterContentInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { CellarItem } from 'src/app/core/models/Cellar';
import { CellarService } from 'src/app/core/services/httpServices/cellar.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { TempStorageService } from '../../../../../core/services/httpServices/temp-storage.service';
import { TempSaleService } from '../../../../../core/services/httpServices/temp-sale.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BrandItem } from 'src/app/core/models/Brand';
import { BrandService } from '../../../../../core/services/httpServices/brand.service';
import { FormControl, FormGroup } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { XlsxService } from '../../../../../core/services/internal/XlsxService.service';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss']
})
export class UploadsComponent implements OnInit, AfterContentInit, OnDestroy {

  smallScreen = window.innerWidth < 960 ? true : false;
  loading = false;

  cellarsSubscription: Subscription;
  cellars: CellarItem[];
  centrals: CellarItem[];
  errores: any[];
  errores2: any[];

  currentCellar: string;
  currentFile: any;

  currentCellar2: string;
  currentDate: Date;
  currentFile2: any;

  brandsSubscription: Subscription;
  brands: BrandItem[];
  options: BrandItem[] = [];
  filteredOptions: Observable<BrandItem[]>;
  currentCellar3: string;
  range = new FormGroup({
    _brand: new FormControl(),
  });

  constructor(
    public cellarService: CellarService,
    private toastyService: ToastyService,
    public tempStorageService: TempStorageService,
    public tempSaleService: TempSaleService,
    public dialog: MatDialog,
    public brandService: BrandService,
    public xlsxService: XlsxService
  ) {
    this.cellarsSubscription = this.cellarService
    .readData()
    .subscribe((data) => {
      this.cellars = data;
      this.centrals = this.cellars.filter(c => c.type === 'BODEGA');
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

  ngAfterContentInit() {
    this.cellarService.loadData();
  }

  ngOnDestroy(): void {
    this.cellarsSubscription.unsubscribe();
  }

  loadStorage(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Cargar INVENTARIO',
        message:
          '¿Confirma que desea ingresar el archivo de existencias?'
      },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        if (!this.currentCellar) {
          this.toastyService.error('Debe seleccionar una sucursal');
          return;
        }
        this.loading = true;
        if (this.currentFile) {
          this.tempStorageService.uploadFile(this.currentFile.files[0], this.currentCellar)
          .then((resp: any) => {
            this.loading = false;
            this.toastyService.success('Inventario actualizado correctamente');
            this.errores = resp.errors;
            this.currentCellar = undefined;
            this.currentFile = undefined;
          })
          .catch(err => {
            this.loading = false;
            this.toastyService.error('Error al cargar el archivo');
          });
        }else {
          this.loading = false;
          this.toastyService.error('Debe seleccionar un archivo');
          return;
        }
      }
    });
  }

  loadSale(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Cargar VENTAS',
        message:
          '¿Confirma que desea ingresar el archivo de VENTAS?',
      },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        if (!this.currentCellar2 || !this.currentDate) {
          this.toastyService.error('Debe seleccionar una sucursal y una fecha');
          return;
        }
        this.loading = true;
        if (this.currentFile2) {
          this.tempSaleService.uploadFile(this.currentFile2.files[0],
            {
              _cellar: this.currentCellar2,
              date: this.currentDate,
            })
          .then((resp: any) => {
            this.loading = false;
            this.toastyService.success('Ventas ingresadas correctamente');
            this.errores2 = resp.errors;
            this.currentCellar2 = undefined;
            this.currentFile2 = undefined;
          })
          .catch(err => {
            this.loading = false;
            this.toastyService.error('Error al cargar el archivo');
          });
        }else {
          this.loading = false;
          this.toastyService.error('Debe seleccionar un archivo');
          return;
        }
      }
    });
  }

  loadSaleDelete(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'ANULAR VENTAS',
        message:
          '¿Confirma que desea ingresar el archivo para ANULAR las ventas?',
      },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        if (!this.currentCellar2 || !this.currentDate) {
          this.toastyService.error('Debe seleccionar una sucursal y una fecha');
          return;
        }
        this.loading = true;
        if (this.currentFile2) {
          this.tempSaleService.uploadFileDelete(this.currentFile2.files[0],
            {
              _cellar: this.currentCellar2,
              date: this.currentDate,
            })
          .then((resp: any) => {
            this.loading = false;
            this.toastyService.success('Ventas eliminadas correctamente');
            this.errores2 = resp.errors;
            this.currentCellar2 = undefined;
            this.currentFile2 = undefined;
          })
          .catch(err => {
            this.loading = false;
            this.toastyService.error('Error al cargar el archivo');
          });
        }else {
          this.loading = false;
          this.toastyService.error('Debe seleccionar un archivo');
          return;
        }
      }
    });
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

  getConsolidated(): void {
    if (!this.currentCellar3) {
      this.toastyService.error('Debe seleccionar una sucursal');
      return;
    }
    const BRAND = this.brands.find(
      (e) => e.name === this.range.controls._brand.value
    );
    if (BRAND) {
      this.loading = true;
      this.tempStorageService.loadConsolidated(
        this.currentCellar3,
        BRAND._id
      ).subscribe((resp: any) => {
        console.log(resp);
        const body = [
          [BRAND.name],
          ['Código', 'Producto'],
        ];

        const ArrayToPrint: any[] = [];

        let bandera = true;
        resp.forEach(item => {

          let suma = 0;
          const row: any[] = [
            item.barcode,
            item.description
          ];

          item.results.forEach(storage => {
            if (bandera) {
              body[1].push('Sucursal');
              body[1].push('Inventario');
              body[1].push('Pedido');
              body[1].push('Devoluciones');
              body[1].push('Faltantes');
            }

            row.push(storage.cellar)
            row.push(storage.stock)
            row.push(storage.supply)
            suma += storage.supply;

            if (storage.stock > storage.maxStock) {
              row.push(+storage.stock - +storage.maxStock)
            } else {
              row.push(0);
            }
            if (storage.stock < storage.minStock) {
              row.push(+storage.minStock - +storage.stock);
            } else {
              row.push(0);
            }
          });
          bandera = false;

          row.push(suma);
          row.push(item.stockCellar);
          row.push(+suma - +item.stockCellar);

          ArrayToPrint.push(row);
        });
        body[1].push('SUBTOTAL');
        body[1].push('BODEGA');
        body[1].push('TOTAL');

        ArrayToPrint.forEach((row) => body.push(row));

        this.xlsxService.downloadSinglePage(
          body,
          'Inventario Consolidado',
          BRAND.name
        );
        this.loading = false;
      });
    }else {
      this.toastyService.error('Debe seleccionar un laboratorio');
    }
  }
}
