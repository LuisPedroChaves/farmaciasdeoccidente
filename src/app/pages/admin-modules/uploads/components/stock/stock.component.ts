import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { CellarItem } from '../../../../../core/models/Cellar';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { TempStorageService } from '../../../../../core/services/httpServices/temp-storage.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {

  loading = false;
  currentCellar: string;
  currentFile: any;
  errores: any[] = [];

  files = [];

  constructor(
    private dialog: MatDialog,
    private toastyService: ToastyService,
    private tempStorageService: TempStorageService
  ) { }

  ngOnInit(): void {
  }

  getCellar(cellar: CellarItem): void {
    this.currentCellar = cellar._id;
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
              this.toastyService.success('Archivo subido, el inventario se actualizará en segundo plano');
              this.errores = resp.errors;
            })
            .catch(err => {
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
