import { Component, OnInit, AfterContentInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { CellarItem } from 'src/app/core/models/Cellar';
import { CellarService } from 'src/app/core/services/httpServices/cellar.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { TempStorageService } from '../../../../../core/services/httpServices/temp-storage.service';
import { TempSaleService } from '../../../../../core/services/httpServices/temp-sale.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
  errores: any[];
  errores2: any[];

  currentCellar: string;
  currentFile: any;

  currentCellar2: string;
  currentDate: Date;
  currentFile2: any;

  constructor(
    public cellarService: CellarService,
    private toastyService: ToastyService,
    public tempStorageService: TempStorageService,
    public tempSaleService: TempSaleService,
    public dialog: MatDialog,
  ) {
    this.cellarsSubscription = this.cellarService
    .readData()
    .subscribe((data) => {
      this.cellars = data;
    });
  }

  ngOnInit(): void {
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
}
