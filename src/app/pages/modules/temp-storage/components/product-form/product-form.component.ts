import { AfterContentInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BrandItem } from 'src/app/core/models/Brand';
import { ProductItem } from 'src/app/core/models/Product';
import { BrandService } from 'src/app/core/services/httpServices/brand.service';
import { OrderService } from 'src/app/core/services/httpServices/order.service';
import { ProductService } from 'src/app/core/services/httpServices/product.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, AfterContentInit, OnDestroy {


  isMatDialog = false;

  showButtomAddPresentations = true;

  presentationsDefault: string[] = ['UNIDAD', 'TABLETA', 'CAJA'];
  filterPresentations: Observable<string[]>[] = [];

  @ViewChild('barcode') barcode: ElementRef<HTMLInputElement>;

  // End Variables of chips

  get presentationsForm(): FormArray {
    return this.form.get('presentations') as FormArray;
  }

  form = new FormGroup({
    _brand: new FormControl(null, [Validators.required]),
    barcode: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    presentations: this.formBuilder.array([]),
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
    private formBuilder: FormBuilder,
    public toasty: ToastyService,
    public brandService: BrandService,
    public productService: ProductService,
    public router: Router,
    public dialogRef: MatDialogRef<ProductFormComponent>
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

    this.defaultPresentations();
    setTimeout(() => {
      this.barcode.nativeElement.focus();
    });
  }

  defaultPresentations(): void {
    // PRESENTACIONES POR DEFECTO
    const UNIDAD = this.formBuilder.group({
      name: new FormControl('UNIDAD', [Validators.required]),
      wholesale_price: new FormControl(null, [Validators.required]),
      distributor_price: new FormControl(null, [Validators.required]),
      retail_price: new FormControl(null, [Validators.required]),
      cf_price: new FormControl(null, [Validators.required]),
      quantity: new FormControl(1, [Validators.required]),
      commission: new FormControl(0, [Validators.required]),
    });
    this.presentationsForm.push(UNIDAD);
    this.manageNameControl(this.presentationsForm.length - 1);
  }

  manageNameControl(index: number): void {
    const arrayControl = this.form.get('presentations') as FormArray;

    this.filterPresentations[index] = arrayControl
      .at(index)
      .get('name')
      .valueChanges.pipe(
        startWith(''),
        map((name) =>
          name
            ? this._filterPresentations(name)
            : this.presentationsDefault.slice()
        )
      );
  }

  displayFn(presentation?: string): string | undefined {
    return presentation ? presentation : undefined;
  }

  ngAfterContentInit(): void {
    this.brandService.loadData();
  }

  ngOnDestroy(): void {
    this.brandsSubscription?.unsubscribe();
  }

  addPresentation(): void {
    const presentationFormGroup = this.formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      wholesale_price: new FormControl(null, [Validators.required]),
      distributor_price: new FormControl(null, [Validators.required]),
      retail_price: new FormControl(null, [Validators.required]),
      cf_price: new FormControl(null, [Validators.required]),
      quantity: new FormControl(1, [Validators.required]),
      commission: new FormControl(null, [Validators.required]),
    });
    this.presentationsForm.push(presentationFormGroup);
    this.manageNameControl(this.presentationsForm.length - 1);
  }

  removePresentation(indice: number): void {
    this.presentationsForm.removeAt(indice);
    this.showButtomAddPresentations = true;

    this.filterPresentations.splice(indice, 1);
  }

  refreshForms(): void {
    this.presentationsForm.controls.splice(0, this.presentationsForm.length);
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


  private _filterPresentations(value: string): string[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.presentationsDefault.filter((presentation) =>
        presentation.toLowerCase().includes(filterValue)
      );
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
          this.refreshForms();
          this.toasty.success('Producto Creado Exitosamente');
          this.loading = false;
          if (this.isMatDialog) {
            this.dialogRef.close('ok');
          }
          this.barcode.nativeElement.focus();
          this.defaultPresentations();
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
