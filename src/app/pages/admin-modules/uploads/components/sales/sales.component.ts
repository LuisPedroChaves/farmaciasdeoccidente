import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import * as XLSX from 'xlsx';

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
          const selectedFile = this.currentFile2.files[0];
          const fileReader = new FileReader();

          fileReader.readAsBinaryString(selectedFile);
          fileReader.onload = async (event: any) => {
            if (event.target) {
              const binaryData = event.target.result;
              const workbook = XLSX.read(binaryData, { type: 'binary' });
              await workbook.SheetNames.forEach(async (sheet) => {
                const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
                const FILE = {
                  name: selectedFile.name,
                  progress: 0,
                  currentIndex: 1,
                  items: data
                }
                this.files.push(FILE);
                const INDEX = await this.updateSale(0, (this.files.length - 1));
                this.toastyService.success('Ventas ingresadas correctamente');
                this.files[INDEX].progress = 100;
              });
            }
          };
        } else {
          this.loading = false;
          this.toastyService.error('Debe seleccionar un archivo');
          return;
        }
      }
    });
  }

  updateSale(index: number,  indexArray: number): any {
    return new Promise(async (resolve, reject) => {
      const saleItem = this.files[indexArray].items.find((c, i) => i === index);
      if (saleItem) {
        this.files[indexArray].progress = (index * 100) / this.files[indexArray].items.length;
        this.files[indexArray].currentIndex = index + 1;
        const BODY = {
          _cellar: this.currentCellar2,
          date: saleItem.Fecha,
          barcode: saleItem.Producto,
          quantity: saleItem.Cantidad,
          delete: null
        }
        this.tempSaleService
          .update(BODY)
          .subscribe(async (resp) => {
            // if (!resp.ok) {
            //   this.errores.push(resp.mensaje);
            // }
            index++;
            await this.updateSale(index, indexArray);
            resolve(indexArray);
          });
      } else {
        resolve(indexArray);
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
          const selectedFile = this.currentFile2.files[0];
          const fileReader = new FileReader();

          fileReader.readAsBinaryString(selectedFile);
          fileReader.onload = async (event: any) => {
            if (event.target) {
              const binaryData = event.target.result;
              const workbook = XLSX.read(binaryData, { type: 'binary' });
              await workbook.SheetNames.forEach(async (sheet) => {
                const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
                const FILE = {
                  name: `ANULAR: ${selectedFile.name}`,
                  progress: 0,
                  currentIndex: 1,
                  items: data
                }
                this.files.push(FILE);
                const INDEX = await this.updateSaleDelete(0, (this.files.length - 1));
                this.toastyService.success('Ventas anuladas correctamente');
                this.files[INDEX].progress = 100;
              });
            }
          };
        } else {
          this.loading = false;
          this.toastyService.error('Debe seleccionar un archivo');
          return;
        }
      }
    });
  }

  updateSaleDelete(index: number, indexArray: number): any {
    return new Promise(async (resolve, reject) => {
      const saleItem = this.files[indexArray].items.find((c, i) => i === index);
      if (saleItem) {
        this.files[indexArray].progress = (index * 100) / this.files[indexArray].items.length;
        this.files[indexArray].currentIndex = index + 1;
        const BODY = {
          _cellar: this.currentCellar2,
          date: saleItem.Fecha,
          barcode: saleItem.Producto,
          quantity: saleItem.Cantidad,
          delete: true
        }
        this.tempSaleService
          .update(BODY)
          .subscribe(async (resp) => {
            // if (!resp.ok) {
            //   this.errores.push(resp.mensaje);
            // }
            index++;
            await this.updateSaleDelete(index, indexArray);
            resolve(indexArray);
          });
      } else {
        resolve(indexArray);
      }
    });
  }

}
