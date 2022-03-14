import {
  Component,
  OnInit,
  AfterContentInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
// instalation necesary: npm install --save xlsx
import * as XLSX from 'xlsx';

import { CellarItem } from 'src/app/core/models/Cellar';
import { CellarService } from 'src/app/core/services/httpServices/cellar.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { TempStorageService } from '../../../../../core/services/httpServices/temp-storage.service';
import { TempSaleService } from '../../../../../core/services/httpServices/temp-sale.service';
import { BrandItem } from 'src/app/core/models/Brand';
import { BrandService } from '../../../../../core/services/httpServices/brand.service';
import { XlsxService } from '../../../../../core/services/internal/XlsxService.service';
import { ProductService } from '../../../../../core/services/httpServices/product.service';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss'],
})
export class UploadsComponent implements OnInit, AfterContentInit, OnDestroy {
  smallScreen = window.innerWidth < 960 ? true : false;
  loading = false;

  cellarsSubscription: Subscription;
  cellars: CellarItem[];
  errores: any[];
  errores2: any[];

  currentCellar: string;
  currentFile: any;

  currentCellar2: string;
  currentFile2: any;

  currentFile3: any;

  itemsInventory = [];

  constructor(
    public cellarService: CellarService,
    private toastyService: ToastyService,
    public tempStorageService: TempStorageService,
    public tempSaleService: TempSaleService,
    public dialog: MatDialog,
    public brandService: BrandService,
    public xlsxService: XlsxService,
    public productService: ProductService
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

  loadProducts(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Cargar PRODUCTOS',
        message: '¿Confirma que desea ingresar el archivo de productos?',
      },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.loading = true;
        if (this.currentFile3) {
          this.productService
            .uploadFile(this.currentFile3.files[0])
            .then((resp: any) => {
              this.loading = false;
              this.toastyService.success(
                'Productos actualizados correctamente'
              );
            })
            .catch((err) => {
              this.loading = false;
              this.toastyService.error('Error al cargar el archivo');
            });
        } else {
          this.loading = false;
          this.toastyService.error('Debe seleccionar un archivo');
          return;
        }
      }
    });
  }

  loadStorage(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Cargar INVENTARIO',
        message: '¿Confirma que desea ingresar el archivo de existencias?',
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
          const selectedFile = this.currentFile.files[0];
          const fileReader = new FileReader();

          fileReader.readAsBinaryString(selectedFile);
          fileReader.onload = async (event: any) => {
            if (event.target) {
              const binaryData = event.target.result;
              const workbook = XLSX.read(binaryData, { type: 'binary' });

              await workbook.SheetNames.forEach((sheet) => {
                const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
                this.itemsInventory = data;
                console.log(this.itemsInventory);
                this.updateInventory(this.currentCellar);
              });
            }
          };
          // this.tempStorageService.uploadFile(this.currentFile.files[0], this.currentCellar)
          // .then((resp: any) => {
          //   this.loading = false;
          //   this.toastyService.success('Inventario actualizado correctamente');
          //   this.errores = resp.errors;
          //   this.currentCellar = undefined;
          //   this.currentFile = undefined;
          // })
          // .catch(err => {
          //   this.loading = false;
          //   this.toastyService.error('Error al cargar el archivo');
          // });
        } else {
          this.loading = false;
          this.toastyService.error('Debe seleccionar un archivo');
          return;
        }
      }
    });
  }

  // tslint:disable-next-line: variable-name
  async updateInventory(_cellar: string): Promise<any> {
    if (this.itemsInventory.length > 0) {
      const send = await Promise.all(
        this.itemsInventory.map(async (item: any) => {
          await this.tempStorageService
            .updateByBarcode(_cellar, item.codigo, item.Inventario)
            .subscribe((res: any) => {
              console.log('hola', res);
            });
        })
      );
    }
  }

  stockReset(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Restablecer inventario',
        message:
          '¿Confirma que desea restablecer el inventario a CERO existencias?',
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
        this.tempStorageService
          .stockReset(this.currentCellar)
          .subscribe((resp: any) => {
            this.loading = false;
            this.toastyService.success('Inventario restablecido correctamente');
          });
      }
    });
  }

  loadSale(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Cargar VENTAS',
        message: '¿Confirma que desea ingresar el archivo de VENTAS?',
      },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        if (!this.currentCellar2) {
          this.toastyService.error('Debe seleccionar una sucursal');
          return;
        }
        this.loading = true;
        if (this.currentFile2) {
          this.tempSaleService
            .uploadFile(this.currentFile2.files[0], {
              _cellar: this.currentCellar2,
            })
            .then((resp: any) => {
              this.loading = false;
              this.toastyService.success('Ventas ingresadas correctamente');
              this.errores2 = resp.errors;
              this.currentCellar2 = undefined;
              this.currentFile2 = undefined;
            })
            .catch((err) => {
              this.loading = false;
              this.toastyService.error('Error al cargar el archivo');
            });
        } else {
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
        if (!this.currentCellar2) {
          this.toastyService.error('Debe seleccionar una sucursal');
          return;
        }
        this.loading = true;
        if (this.currentFile2) {
          this.tempSaleService
            .uploadFileDelete(this.currentFile2.files[0], {
              _cellar: this.currentCellar2,
            })
            .then((resp: any) => {
              this.loading = false;
              this.toastyService.success('Ventas eliminadas correctamente');
              this.errores2 = resp.errors;
              this.currentCellar2 = undefined;
              this.currentFile2 = undefined;
            })
            .catch((err) => {
              this.loading = false;
              this.toastyService.error('Error al cargar el archivo');
            });
        } else {
          this.loading = false;
          this.toastyService.error('Debe seleccionar un archivo');
          return;
        }
      }
    });
  }
}
