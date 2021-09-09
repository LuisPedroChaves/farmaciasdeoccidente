import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PurchaseItem } from '../../../../../core/models/Purchase';
import { ProviderService } from '../../../../../core/services/httpServices/provider.service';
import { ProviderItem } from '../../../../../core/models/Provider';

@Component({
  selector: 'app-new-purchase',
  templateUrl: './new-purchase.component.html',
  styleUrls: ['./new-purchase.component.scss']
})
export class NewPurchaseComponent implements OnInit, AfterContentInit, OnDestroy {

  smallScreen = window.innerWidth < 960 ? true : false;

  newPurchase: PurchaseItem = {
    _cellar: null,
    _user: null,
    _provider: null,
    noBill: '',
    date: new Date(),
    requisition: '',
    details: '',
    detail: [],
    adjust: [],
    payment: 'CONTADO',
    total: 0,
    file: ''
  }

  providerSubscription: Subscription;
  providers: ProviderItem[] = [];

  constructor(
    public providerService: ProviderService
  ) { }

  ngOnInit(): void {
    this.providerSubscription = this.providerService.readData().subscribe(data => {
      this.providers = data;
    });
  }

  ngAfterContentInit() {
    this.providerService.loadData();
  }

  ngOnDestroy() {
    this.providerSubscription?.unsubscribe();
  }

  validForm(): boolean {
    //TODO: Validar formularios, revisar el documento de angular
    return
  }

  getTotal(): number {
    let total = 0;
    this.newPurchase.detail.forEach(p => {
      const t = p.quantity * p.price;
      total += t;
    });
    return total;
  }

}
