import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { CellarItem } from '../../../../../core/models/Cellar';
import { TempSaleService } from '../../../../../core/services/httpServices/temp-sale.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {

  loading = false;
  currentCellar2: string;
  currentFile2: any;
  errores2: any[];

  files = [];

  constructor(
    private dialog: MatDialog,
    private toastyService: ToastyService,
    private tempSaleService: TempSaleService
  ) { }

  ngOnInit(): void {
  }

  getCellar(cellar: CellarItem): void {
    this.currentCellar2 = cellar._id;
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
            if (!this.currentCellar2) {
                this.toastyService.error('Debe seleccionar una sucursal');
                return;
            }
            this.loading = true;
            if (this.currentFile2) {
                this.tempSaleService.uploadFile(this.currentFile2.files[0],
                    {
                        _cellar: this.currentCellar2,
                    })
                    .then((resp: any) => {
                        this.loading = false;
                        this.toastyService.success('Archivo subido,  las ventas se actualizarán en segundo plano');
                        this.errores2 = resp.errors;
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
                this.tempSaleService.uploadFileDelete(this.currentFile2.files[0],
                    {
                        _cellar: this.currentCellar2,
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
            } else {
                this.loading = false;
                this.toastyService.error('Debe seleccionar un archivo');
                return;
            }
        }
    });
}

}
