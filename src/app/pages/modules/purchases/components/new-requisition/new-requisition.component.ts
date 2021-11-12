import { AfterContentInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl, ValidatorFn } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs/internal/Subscription';

import { CellarItem } from 'src/app/core/models/Cellar';
import { ProviderItem } from 'src/app/core/models/Provider';
import { ProductItem } from 'src/app/core/models/Product';
import { ProviderService } from 'src/app/core/services/httpServices/provider.service';
import { ProductService } from 'src/app/core/services/httpServices/product.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { PurchaseService } from 'src/app/core/services/httpServices/purchase.service';
import { NewProviderComponent } from 'src/app/pages/admin-modules/providers/components/new-provider/new-provider.component';
import { ProductModalFormComponent } from 'src/app/pages/admin-modules/products/components/product-form/product-modal-form.component';
import { PurchaseDetailItem, PurchaseItem } from 'src/app/core/models/Purchase';

@Component({
  selector: 'app-new-requisition',
  templateUrl: './new-requisition.component.html',
  styleUrls: ['./new-requisition.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class NewRequisitionComponent implements OnInit, AfterContentInit, OnDestroy {
  smallScreen = window.innerWidth < 960 ? true : false;
  loading = false;
  currentCellar: CellarItem;

  @ViewChild('provider') provider: ElementRef<HTMLInputElement>;

  get detailForm(): FormArray {
    return this.form.get('detail') as FormArray;
  }

  form = new FormGroup({
    _cellar: new FormControl(null),
    _user: new FormControl(null),
    _provider: new FormControl(null, Validators.required),
    payment: new FormControl('CONTADO'),
    detail: this.FormBuilder.array([]),
  });

  formDetail = new FormGroup({
    _product: new FormControl(null, Validators.required),
    requested: new FormControl('', Validators.required),
    max: new FormControl(0)
  });

  providerSubscription: Subscription;
  providers: ProviderItem[] = [];
  filteredOptions: Observable<ProviderItem[]>;

  filteredProducts: Observable<ProductItem[]>[] = [];
  isLoading = false;

  displayedColumns: string[] = ['requested', '_product', 'remove'];
  dataSource = new BehaviorSubject<AbstractControl[]>([]);

  constructor(
    public providerService: ProviderService,
    public productService: ProductService,
    public toasty: ToastyService,
    public purchaseService: PurchaseService,
    private router: Router,
    public dialog: MatDialog,
    private FormBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.providerSubscription = this.providerService
      .readData()
      .subscribe((data) => {
        this.providers = data;
      });
    this.filteredOptions =
      this.form.controls._provider.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value))
      );
    this.addRow(null);

    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
    setTimeout(() => {
      this.provider.nativeElement.focus();
    }, 500);
  }

  ngAfterContentInit(): void {
    this.providerService.loadData();
  }

  ngOnDestroy(): void {
    this.providerSubscription?.unsubscribe();
  }

  private _filter(value: string): ProviderItem[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.providers.filter((provider) =>
        provider.name.toLowerCase().includes(filterValue)
      );
    } else {
      return [];
    }
  }

  getShowDescription(product: ProductItem): string {
    return product ? product.description : '';
  }

  isObject(control: FormControl): ValidatorFn {
    return typeof control.value === 'object' ? null : control.value;
  }

  manageProductControl(index: number) {
    this.detailForm.at(index).get('_product').valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.filteredProducts = [];
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.productService.search(value).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((data) => {
        this.filteredProducts[index] = data['products'];
      });
  }

  addRow(product: any): void {

    if (product) {
      const DUPLICATE: PurchaseDetailItem[] = this.detailForm.value.filter(
        (d) =>
          d._product && d._product._id === product._id &&
          d._product.presentations._id === product.presentations._id
      );

      if (DUPLICATE.length > 1) {
        this.toasty.toasty('warning', '¡El producto ya fue agregado!');
        return;
      }
    }

    const NEW_DETAIL: FormGroup = this.FormBuilder.group({
      requested: new FormControl(null, Validators.required),
      _product: new FormControl(null, [
        Validators.required,
        this.isObject
      ]),
      max: new FormControl(0),
    });
    this.detailForm.push(NEW_DETAIL);

    this.manageProductControl(this.detailForm.length - 1);
    this.dataSource.next(this.detailForm.controls);
  }

  removeRow(index: number): void {
    this.detailForm.removeAt(index);
    this.dataSource.next(this.detailForm.controls);
    this.filteredProducts = [];

    this.detailForm.value.forEach((detail, index) => {
      this.manageProductControl(index);
    });
  }

  savePurchase(): void {

    this.loading = true;
    this.form.get('_cellar').setValue(this.currentCellar);

    let purchase: PurchaseItem = { ...this.form.value };
    this.purchaseService.createPurchase(purchase).subscribe(
      (data) => {
        if (data.ok === true) {
          this.toasty.success('Requisición creada exitosamente');
          this.router.navigate(['/purchases']);
          this.loading = false;
        } else {
          this.loading = false;
          this.toasty.error('Error al crear la requisición');
        }
      },
      (err) => {
        this.loading = false;
        this.toasty.error('Error al crear la requisición');
      }
    );
  }

  addProduct(): void {
    const dialogRef = this.dialog.open(ProductModalFormComponent, {
      width: this.smallScreen ? '100%' : '800px',
      data: {
        by: 'NewPurchase',
      },

      minHeight: '78vh',
      maxHeight: '78vh',
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
      }
    });
  }
  addProvider(): void {
    const dialogRef = this.dialog.open(NewProviderComponent, {
      width: this.smallScreen ? '100%' : '800px',
      data: {
        by: 'NewPurchase',
      },

      minHeight: '78vh',
      maxHeight: '78vh',
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.providerService.loadData();
      }
    });
  }

}
