import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PurchaseItem } from '../../../../../core/models/Purchase';
import { PurchaseService } from '../../../../../core/services/httpServices/purchase.service';
import { ProductItem } from '../../../../../core/models/Product';

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
    public purchaseService: PurchaseService
  ) { }

  ngOnInit(): void {
    this.activeRoute.params
    .subscribe( ({id}) => {
      this.purchaseService.getById(id)
        .subscribe( resp => {
          this.purchase = resp.purchase;
          this.purchase.detail = this.purchase.detail.filter(detail => detail.changedPrice !== 0);
        });
    });
  }

}
