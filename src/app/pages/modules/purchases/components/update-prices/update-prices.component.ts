import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PurchaseItem, PurchaseDetailItem } from '../../../../../core/models/Purchase';
import { PurchaseService } from '../../../../../core/services/httpServices/purchase.service';
import { ProductItem } from '../../../../../core/models/Product';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';

@Component({
  selector: 'app-update-prices',
  templateUrl: './update-prices.component.html',
  styleUrls: ['./update-prices.component.scss']
})
export class UpdatePricesComponent implements OnInit {

  smallScreen = window.innerWidth < 960 ? true : false;

  purchase: PurchaseItem;
  selectedProduct: ProductItem;

  constructor(
    private activeRoute: ActivatedRoute,
    public purchaseService: PurchaseService,
    private toasty: ToastyService
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

  selectProduct(detail: PurchaseDetailItem) {
    if (detail.updated) {
      this.toasty.error('Este producto ya fue actualizado')
    }
    this.selectedProduct = detail._product;
    let newPresentations: any[] = this.selectedProduct.presentations.filter(p => p.name === detail.presentation);
    if (newPresentations[0]) {
      newPresentations[0].wholesale_newPrice = newPresentations[0].wholesale_price + ((newPresentations[0].wholesale_price * this.calcPercent(detail.cost, detail.lastCost)) / 100) ;
      newPresentations[0].distributor_newPrice = newPresentations[0].distributor_price + ((newPresentations[0].distributor_price * this.calcPercent(detail.cost, detail.lastCost)) / 100) ;
      newPresentations[0].retail_newPrice = newPresentations[0].retail_price + ((newPresentations[0].retail_price * this.calcPercent(detail.cost, detail.lastCost)) / 100) ;
      newPresentations[0].cf_newPrice = newPresentations[0].cf_price + ((newPresentations[0].cf_price * this.calcPercent(detail.cost, detail.lastCost)) / 100) ;
    }
    this.selectedProduct.presentations = newPresentations;
  }

}
