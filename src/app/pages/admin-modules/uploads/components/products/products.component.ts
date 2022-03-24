import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import * as XLSX from 'xlsx';

import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { ProductService } from '../../../../../core/services/httpServices/product.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  loading = false;
  currentFile: any;
  withBrand = false;
  products: any[] = []
  progress = 0;
  currentIndex = 1;

  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private toastyService: ToastyService
  ) { }

  ngOnInit(): void {
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
                this.products = data;
                await this.updateProduct(0);
                this.toastyService.success('Productos actualizados correctamente');
                this.progress = 0;
                this.loading = false;
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

  updateProduct(index: number): any {
    return new Promise(async (resolve, reject) => {
      const productItem = this.products.find((c, i) => i === index);
      if (productItem) {
        this.progress = (index * 100) / this.products.length;
        this.currentIndex = index;

        const BODY = {
          barcode: productItem.codigo,
          description: productItem.descripcion,
          _brand: this.withBrand ? productItem.laboratorio : null,
          cost: productItem.costo,
          wholesale_price: productItem.mayorista,
          distributor_price: productItem.distribuidor,
          retail_price: productItem.minorista,
          cf_price: productItem.cf
        };


        this.productService
          .update(
            BODY
          )
          .subscribe(async (resp) => {
            // if (!resp.ok) {
            //   this.errores.push(resp.mensaje);
            // }
            index++;
            await this.updateProduct(index);
            resolve(true);
          });
      } else {
        resolve(true);
      }
    });
  }

}
