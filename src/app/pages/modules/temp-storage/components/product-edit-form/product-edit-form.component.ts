import {
  AfterContentInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  styleUrls: ['./product-edit-form.component.scss'],
})
export class ProductEditFormComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  @ViewChild('barcode') barcode: ElementRef<HTMLInputElement>;

  form = new FormGroup({
    _brand: new FormControl(null, [Validators.required]),
    barcode: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
  });

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
    public dialogRef: MatDialogRef<ProductEditFormComponent>,
    @Inject(MAT_DIALOG_DATA) public info: any
  ) {}

  ngOnInit(): void {
    this.loadProduct();
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

  loadProduct(): void {
    console.log(this.info);
    this.form.setValue({
      _brand: this.info.product._product._brand.name,
      barcode: this.info.product._product.barcode,
      description: this.info.product._product.description,
    });
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
    this.info.product._product._brand.name = this.form.controls._brand;
    this.info.product._product.barcode = this.form.controls.barcode;
    this.info.product._product.description = this.form.controls.description;

    const response = this.info.product;
    this.dialogRef.close();
  }
}
