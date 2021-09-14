import { AfterContentInit, OnDestroy, OnInit } from '@angular/core';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
import { SubstanceItem } from '../../../../../core/models/Substance';
import { SymptomItem } from '../../../../../core/models/Symptom';
import { SymptomService } from 'src/app/core/services/httpServices/symptom.service';
import { SubstanceService } from '../../../../../core/services/httpServices/substance.service';
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
  showButtomAddPresentations = true;

  // END variables to Test

  // variables of chips
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  // Substance
  substanceSubscription: Subscription;
  substanceItems: SubstanceItem[];
  filteredSubstances: Observable<SubstanceItem[]>;
  substancesSource: SubstanceItem[] = [];

  substances: SubstanceItem[] = [];
  // END Substance

  // Symptom
  symptomSubscription: Subscription;
  symptomsItems: SymptomItem[];
  filteredSymptoms: Observable<SymptomItem[]>;
  symptomsSource: SymptomItem[] = [];

  symptoms: SymptomItem[] = [];
  // END Symptom

  @ViewChild('substanceInput') substanceInput: ElementRef<HTMLInputElement>;
  @ViewChild('symptomInput') symptomInput: ElementRef<HTMLInputElement>;

  // End Variables of chips

  get presentationsForm(): FormArray {
    return this.form.get('presentations') as FormArray;
  }

  form = new FormGroup({
    brand: new FormControl(null, [Validators.required]),
    code: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    healthProgram: new FormControl(null),
    substances: new FormControl(null),
    symptoms: new FormControl(null),
    min: new FormControl(null, [Validators.required]),
    max: new FormControl(null, [Validators.required]),

    presentations: this.formBuilder.array([]),
  });

  loading = false;
  public data: any;
  product: ProductItem;

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
    public orderService: OrderService,
    public toasty: ToastyService,
    public brandService: BrandService,
    public productService: ProductService,
    private symptomService: SymptomService,
    private substanceService: SubstanceService
  ) {}

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
        healthProgram: new FormControl(this.data.product.healthProgram),
        substances: new FormControl(this.data.product.substances),
        symptoms: new FormControl(this.data.product.symptoms),
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

    this.symptomSubscription = this.symptomService
      .readData()
      .subscribe((data) => {
        this.symptomsItems = data;
        this.symptomsSource = [...this.symptomsItems];
      });

    this.substanceSubscription = this.substanceService
      .readData()
      .subscribe((data) => {
        this.substanceItems = data;
        this.substancesSource = [...this.substanceItems];
      });

    this.filteredOptions = this.form.controls.brand.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterBrands(value))
    );

    this.filteredSubstances = this.form.controls.substances.valueChanges.pipe(
      startWith(''),
      map((substance) => this._filterSubstances(substance))
    );

    this.filteredSymptoms = this.form.controls.symptoms.valueChanges.pipe(
      startWith(''),
      map((symptom) => this._filterSymptoms(symptom))
    );
  }

  ngAfterContentInit(): void {
    this.brandService.loadData();
    this.symptomService.loadData();
    this.substanceService.loadData();
  }

  ngOnDestroy(): void {
    this.brandsSubscription?.unsubscribe();
    this.symptomSubscription?.unsubscribe();
    this.substanceSubscription?.unsubscribe();
  }

  addPresentation(): void {
    const presentationFormGroup = this.formBuilder.group({
      presentation: new FormControl(null, [Validators.required]),
      wholesale_price: new FormControl(null, [Validators.required]),
      distributor_price: new FormControl(null, [Validators.required]),
      retail_price: new FormControl(null, [Validators.required]),
      cf_price: new FormControl(null, [Validators.required]),
      commission: new FormControl(null, [Validators.required]),
    });
    this.presentationsForm.push(presentationFormGroup);
  }

  removePresentation(indice: number): void {
    this.presentationsForm.removeAt(indice);
    this.showButtomAddPresentations = true;
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

  // Functions to Chips
  addSubstance(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our substances
    if (value) {
      this.substances.push({ name: value });
    }
    // Clear the input value
    if (event.input) {
      event.input.value = '';
    }
    // event.chipInput!.clear();

    this.form.controls.substances.setValue(null);
  }

  addSymptom(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.symptoms.push({ name: value });
    }
    // Clear the input value
    if (event.input) {
      event.input.value = '';
    }

    this.form.controls.symptoms.setValue(null);
  }

  removeSubstance(substance: SubstanceItem): void {
    const index = this.substances.indexOf(substance);

    if (index >= 0) {
      this.substances.splice(index, 1);
    }
  }

  selectedSubstance(event: MatAutocompleteSelectedEvent): void {
    this.substances.push({ name: event.option.viewValue });
    this.substanceInput.nativeElement.value = '';
    this.form.controls.substances.setValue(null);
  }

  private _filterSubstances(value: string): SubstanceItem[] {
    if (value) {
      if (value.length > 2) {
        const filterValue = value.toLowerCase();
        return this.substancesSource.filter((substance) =>
          substance.name.toLowerCase().includes(filterValue)
        );
      }
    }
  }

  removeSymptoms(symptom: SymptomItem): void {
    const index = this.symptoms.indexOf(symptom);
    if (index >= 0) {
      this.symptoms.splice(index, 1);
    }
  }

  selectedSymptom(event: MatAutocompleteSelectedEvent): void {
    this.symptoms.push({ name: event.option.viewValue });
    this.symptomInput.nativeElement.value = '';
    this.form.controls.symptoms.setValue(null);
  }

  private _filterSymptoms(value: string): SymptomItem[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.symptomsSource.filter((symptom) =>
        symptom.name.toLowerCase().includes(filterValue)
      );
    }
  }
  // End Functions to Chips

  saveProduct(): void {
    console.log(this.form, this.substances, this.symptoms);

    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    const product: ProductItem = { ...this.form.value };

    product.substances = this.substances;
    product.symptoms = this.symptoms;
    console.log(product);

    this.productService.createProduct(product).subscribe((res) => {
      console.log(res);
    });
  }
}
