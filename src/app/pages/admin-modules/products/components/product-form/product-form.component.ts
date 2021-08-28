import { AfterContentInit, OnDestroy, OnInit } from '@angular/core';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { BrandItem } from 'src/app/core/models/Brand';
import { ProductItem } from 'src/app/core/models/Product';
import { BrandService } from 'src/app/core/services/httpServices/brand.service';
import { OrderService } from 'src/app/core/services/httpServices/order.service';
import { ProductService } from 'src/app/core/services/httpServices/product.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips/chip-input';
interface Presentation {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  // Variables to TEST
  Presentations: Presentation[] = [
    { value: '0', viewValue: 'Unidad' },
    { value: '1', viewValue: 'Blister' },
    { value: '2', viewValue: 'Caja' },
  ];
  // END variables to Test

  // variables of chips
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Acetaminofen'];
  symptoms: string[] = ['Fiebre', 'Tos'];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;

  // End Variables of chips

  form = new FormGroup({
    brand: new FormControl(null, [Validators.required]),
    code: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    wholesale_price: new FormControl(null, [Validators.required]),
    distributor_price: new FormControl(null, [Validators.required]),
    retail_price: new FormControl(null, [Validators.required]),
    cf_price: new FormControl(null, [Validators.required]),
  });

  // Autocompletado
  orderFind = false;
  brandsSubscription: Subscription;
  brands: BrandItem[];
  options: BrandItem[] = [];
  filteredOptions: Observable<BrandItem[]>;
  product: ProductItem;
  public data: any;

  loading = false;

  constructor(
    public orderService: OrderService,
    public toasty: ToastyService,
    public brandService: BrandService,
    public productService: ProductService
  ) {
    // Variables of Chips
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) =>
        fruit ? this._filter(fruit) : this.allFruits.slice()
      )
    );
    // end Variables of Chips
  }

  ngOnInit(): void {
    if (this.data) {
      this.product = this.data.product;
      this.form = new FormGroup({
        brand: new FormControl(this.data.product._brand.name, [
          Validators.required,
        ]),
        code: new FormControl(this.data.product.code, [Validators.required]),
        description: new FormControl(this.data.product.description, [
          Validators.required,
        ]),
        wholesale_price: new FormControl(this.data.product.wholesale_price, [
          Validators.required,
        ]),
        distributor_price: new FormControl(
          this.data.product.distributor_price,
          [Validators.required]
        ),
        retail_price: new FormControl(this.data.product.retail_price, [
          Validators.required,
        ]),
        cf_price: new FormControl(this.data.product.cf_price, [
          Validators.required,
        ]),
      });
    }

    this.brandsSubscription = this.brandService.readData().subscribe((data) => {
      this.brands = data;
      this.options = [...this.brands];
    });
  }

  ngAfterContentInit(): void {
    this.brandService.loadData();
  }

  ngOnDestroy(): void {
    this.brandsSubscription?.unsubscribe();
  }

  // Autocompletado
  findThis(value): void {
    this.orderFind = false;
    const index = this.brands.findIndex((b) => b.name === value);
    if (index > -1) {
      this.orderFind = true;
    }
  }

  // Functions of Chips
  add(event: MatChipInputEvent): void {
    console.log(event);
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push(value);
    }

    // Clear the input value

    // tslint:disable-next-line: no-non-null-assertion
    event.input!.value = '';

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event);
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter((fruit) =>
      fruit.toLowerCase().includes(filterValue)
    );
  }
  // End Functions of Chips
}
