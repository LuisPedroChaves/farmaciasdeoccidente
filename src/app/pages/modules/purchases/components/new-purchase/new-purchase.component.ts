import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';

import { PurchaseItem, PurchaseDetailItem } from '../../../../../core/models/Purchase';
import { ProviderService } from '../../../../../core/services/httpServices/provider.service';
import { ProviderItem } from '../../../../../core/models/Provider';
import { HttpClient } from '@angular/common/http';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { ProductService } from '../../../../../core/services/httpServices/product.service';

@Component({
  selector: 'app-new-purchase',
  templateUrl: './new-purchase.component.html',
  styleUrls: ['./new-purchase.component.scss']
})
export class NewPurchaseComponent implements OnInit, AfterContentInit, OnDestroy {

  smallScreen = window.innerWidth < 960 ? true : false;

  formPurchase = new FormGroup({
    _cellar: new FormControl(null),
    _user: new FormControl(null),
    _provider: new FormControl(null, Validators.required),
    noBill: new FormControl('', Validators.required),
    date: new FormControl(new Date(), Validators.required),
    requisition: new FormControl(''),
    details: new FormControl(''),
    payment: new FormControl('CONTADO'),
    total: new FormControl(0, Validators.required),
    file: new FormControl('')
  });

  formDetail = new FormGroup({
    _product: new FormControl(null, Validators.required),
    quantity: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    bonus: new FormControl(0, Validators.required),
    discount: new FormControl(0, Validators.required),
    realQuantity: new FormControl(0, Validators.required),
    expirationDate: new FormControl(''),
  });

  detailPurchase: any[] = [];

  providerSubscription: Subscription;
  providers: ProviderItem[] = [];

  searchMoviesCtrl = new FormControl();
  filteredMovies: any;
  isLoading = false;
  errorMsg: string;

  constructor(
    public providerService: ProviderService,
    public productService: ProductService
  ) { }

  ngOnInit(): void {
    this.providerSubscription = this.providerService.readData().subscribe(data => {
      this.providers = data;
    });
    this.searchMoviesCtrl.valueChanges
    .pipe(
      debounceTime(500),
      tap(() => {
        this.errorMsg = "";
        this.filteredMovies = [];
        this.isLoading = true;
      }),
      switchMap(value => this.productService.loadData(1,10, value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe(data => {
    console.log("🚀 ~ file: new-purchase.component.ts ~ line 80 ~ NewPurchaseComponent ~ ngOnInit ~ data", data)
    this.filteredMovies = data;
      // if (data['products'] == undefined) {
      //   this.errorMsg = data['error'];
      //   this.filteredMovies = [];
      // } else {
      //   this.errorMsg = "";
      // }

      console.log(this.filteredMovies);
    });
  }

  ngAfterContentInit() {
    this.providerService.loadData();
  }

  ngOnDestroy() {
    this.providerSubscription?.unsubscribe();
  }

  getTotal(): number {
    let total = 0;

    this.detailPurchase.forEach(p => {
      const t = p.quantity * p.price;
      total += t;
    });
    return total;
  }

  addRow(value) {
    console.log('HOLA ROW');
    this.detailPurchase.push(    {
      _product: {
        name: ''
      },
      quantity: 1,
      price: '',
      bonus: 0,
      discount: 0,
      cost: 0,
      realQuantity: 1,
      expirationDate: null
    });

  }

}
