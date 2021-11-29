import { AfterContentInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BrandItem } from 'src/app/core/models/Brand';
import { ProductItem } from 'src/app/core/models/Product';
import { BrandService } from 'src/app/core/services/httpServices/brand.service';
import { ProductService } from 'src/app/core/services/httpServices/product.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';

@Component({
  selector: 'app-product-edit-form',
  templateUrl: './product-edit-form.component.html',
  styleUrls: ['./product-edit-form.component.scss']
})
export class ProductEditFormComponent implements OnInit, AfterContentInit, OnDestroy {

  isMatDialog = false;

  @ViewChild('barcode') barcode: ElementRef<HTMLInputElement>;

  form = new FormGroup({
    _brand: new FormControl(null, [Validators.required]),
    barcode: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),

  });

  loading = false;
  public data: any;

  // Autocompletado
  // Brand
  orderFind = false;
  brandsSubscription: Subscription;
  brands: BrandItem[];
  options: BrandItem[] = [];
  filteredOptions: Observable<BrandItem[]>;
  // END brand

  constructor(
    public toasty: ToastyService,
    public brandService: BrandService,
    public productService: ProductService,
    public router: Router,
    public dialogRef: MatDialogRef<ProductEditFormComponent>
  ) {

  }

  ngOnInit(): void {
    this.brandsSubscription = this.brandService.readData().subscribe((data) => {
      this.brands = data;
      this.options = [...this.brands];
    });

    this.filteredOptions = this.form.controls._brand.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterBrands(value))
    );

  }

  ngAfterContentInit(): void {
    this.brandService.loadData();
  }

  ngOnDestroy(): void {
    this.brandsSubscription?.unsubscribe();
  }

  private _filterBrands(value: string): BrandItem[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.options.filter((option) =>
        option.name.toLowerCase().includes(filterValue)
      );
    } else {
      return [];
    }
  }

  saveProduct(): void {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    const product: ProductItem = { ...this.form.value };

    product._brand = { name: this.form.value._brand };

    this.productService.createProduct(product).subscribe(
      (res) => {
        if (res.ok) {
          this.form.reset();
          this.toasty.success('Producto Creado Exitosamente');
          this.loading = false;
          if (this.isMatDialog) {
            this.dialogRef.close('ok');
          }
          this.barcode.nativeElement.focus();
        } else {
          this.loading = false;
          this.toasty.error('Error al crear producto');
        }
      },
      (error) => {
        this.loading = false;
        this.toasty.error('Error al crear producto');
      }
    );
  }
}
