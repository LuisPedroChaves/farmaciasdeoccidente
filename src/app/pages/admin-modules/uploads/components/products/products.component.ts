import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

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
  currentFile3: any;

  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private toastyService: ToastyService
  ) {  }

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

}
