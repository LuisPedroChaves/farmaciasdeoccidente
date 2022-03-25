import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

// instalation necesary: npm install --save xlsx
import * as XLSX from 'xlsx';

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

  itemsInventory = [];
  progress = 0;
  currentIndex = 1;

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
              await workbook.SheetNames.forEach(async (sheet) => {
                const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
                this.itemsInventory.push(data);
                await this.updateInventory(0, (this.itemsInventory.length - 1));
                  this.toastyService.success('Inventario actualizado correctamente');
                this.loading = false;
                this.progress = 0;

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

  updateInventory(index: number, indexArray: number): any {
    return new Promise(async (resolve, reject) => {
      const inventoryItem = this.itemsInventory[indexArray].find((c, i) => i === index);
      if (inventoryItem) {
        this.progress = (index * 100) / this.itemsInventory[indexArray].length;
        this.currentIndex = index;
        this.tempStorageService
          .updateByBarcode(this.currentCellar, inventoryItem.codigo, inventoryItem.Inventario )
          .subscribe(async (resp) => {
            if (!resp.ok) {
              this.errores.push(resp.mensaje);
            }
            index++;
            await this.updateInventory(index, indexArray);
            resolve(true);
          });
      } else {
        resolve(true);
      }
    });
  }

}
