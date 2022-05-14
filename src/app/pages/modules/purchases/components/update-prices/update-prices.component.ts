import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { PurchaseItem, PurchaseDetailItem } from '../../../../../core/models/Purchase';
import { PurchaseService } from '../../../../../core/services/httpServices/purchase.service';
import { ProductItem } from '../../../../../core/models/Product';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { ProductService } from '../../../../../core/services/httpServices/product.service';

@Component({
  selector: 'app-update-prices',
  templateUrl: './update-prices.component.html',
  styleUrls: ['./update-prices.component.scss']
})
export class UpdatePricesComponent implements OnInit {

  smallScreen = window.innerWidth < 960 ? true : false;
  loading = false;

  purchase: PurchaseItem;
  selectedProduct: ProductItem;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    public purchaseService: PurchaseService,
    private toasty: ToastyService,
    private dialog: MatDialog,
    public productService: ProductService
  ) { }

  ngOnInit(): void {
    this.activeRoute.params
      .subscribe(({ id }) => {
        this.purchaseService.getById(id)
          .subscribe(resp => {
            this.purchase = resp.purchase;
            this.purchase.detail = this.purchase.detail.filter((detail: PurchaseDetailItem) => this.calcPercent(detail.cost, detail.lastCost)  !== 0);
          });
      });
  }

  calcPercent(cost: number, lastCost: number): number {
    if (lastCost === 0) {
      return 100;
    }
    const DIFF: number = (cost - lastCost);
    const PERCENT: number = (DIFF / lastCost) * 100;
    return PERCENT;
  }

  selectProduct(detail: PurchaseDetailItem, index: number) {
    if (detail.updated) {
      this.toasty.error('Este producto ya fue actualizado')
    }
    this.selectedProduct = detail._product;
    let newPresentations: any[] = this.selectedProduct.presentations.filter(p => p.name === detail.presentation.name);
    if (newPresentations[0]) {
      newPresentations[0].wholesale_newPrice = (newPresentations[0].wholesale_price + ((newPresentations[0].wholesale_price * this.calcPercent(detail.cost, detail.lastCost)) / 100)).toFixed(2) ;
      newPresentations[0].distributor_newPrice = (newPresentations[0].distributor_price + ((newPresentations[0].distributor_price * this.calcPercent(detail.cost, detail.lastCost))) / 100).toFixed(2) ;
      newPresentations[0].retail_newPrice = (newPresentations[0].retail_price + ((newPresentations[0].retail_price * this.calcPercent(detail.cost, detail.lastCost)) / 100)).toFixed(2) ;
      newPresentations[0].cf_newPrice = (newPresentations[0].cf_price + ((newPresentations[0].cf_price * this.calcPercent(detail.cost, detail.lastCost)) / 100)).toFixed(2) ;
    }
    this.selectedProduct.presentations = newPresentations;
    this.selectedProduct.index = index;
  }

  updateProduct() {

    if (!this.selectedProduct.presentations[0]) {
      this.toasty.error('No hay ninguna presentación seleccionada');
      return
    }

    this.loading = true;
    const NEW_PRODUCT: any = {
      _id: this.selectedProduct._id,
      name: this.selectedProduct.presentations[0].name,
      wholesale_price: this.selectedProduct.presentations[0].wholesale_newPrice,
      distributor_price: this.selectedProduct.presentations[0].distributor_newPrice,
      retail_price: this.selectedProduct.presentations[0].retail_newPrice,
      cf_price: this.selectedProduct.presentations[0].cf_newPrice,
    }

    this.productService.updatePrices(NEW_PRODUCT)
      .subscribe(resp => {
        this.purchase.detail[this.selectedProduct.index].updated = true;
        this.purchaseService.detailPurchase(this.purchase)
          .subscribe( resp => {
            this.toasty.success('Precios editados correctamente');
            this.loading = false;
            this.selectedProduct = undefined;
          }, err => {
            this.loading = false;
            this.toasty.error('Error al detalle de compra');
          })
      }, error => {
        this.loading = false;
        this.toasty.error('Error al actualizar precios');
      });
  }

  finish() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Finalizar edición', message: '¿Confirma que desea finalizar la edición de precios en la factura No.  ' + this.purchase.noBill + '?' },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.loading = true;
        this.purchase.state = 'UPDATED';
        this.purchaseService.statePurchase(this.purchase)
          .subscribe(resp => {
            this.router.navigate(['/purchase/updatePrices']);
          }, error => {
          this.loading = false;
          this.toasty.error('Error al finalizar edición');
        });
      }
    });
  }

}
