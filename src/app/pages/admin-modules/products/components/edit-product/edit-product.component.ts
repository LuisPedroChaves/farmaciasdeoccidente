import { ENTER, COMMA } from '@angular/cdk/keycodes';
import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { BrandItem } from 'src/app/core/models/Brand';
import {
  ProductItem,
  ProductItemResponse,
  ProductPresentationsItem,
} from 'src/app/core/models/Product';
import { SubstanceItem } from 'src/app/core/models/Substance';
import { SymptomItem } from 'src/app/core/models/Symptom';
import { BrandService } from 'src/app/core/services/httpServices/brand.service';
import { OrderService } from 'src/app/core/services/httpServices/order.service';
import { ProductService } from 'src/app/core/services/httpServices/product.service';
import { SubstanceService } from 'src/app/core/services/httpServices/substance.service';
import { SymptomService } from 'src/app/core/services/httpServices/symptom.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  @Input() product: ProductItemResponse;

  showButtomAddPresentations = true;

  presentationsDefault: string[] = ['UNIDAD', 'TABLETA', 'CAJA'];
  filterPresentations: Observable<string[]>[] = [];

  // variables of chips
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  // Substance
  substanceSubscription: Subscription;
  substanceItems: SubstanceItem[];
  filteredSubstances: Observable<SubstanceItem[]>;
  substancesSource: SubstanceItem[] = [];

  substances: string[] = [];
  // END Substance

  // Symptom
  symptomSubscription: Subscription;
  symptomsItems: SymptomItem[];
  filteredSymptoms: Observable<SymptomItem[]>;
  symptomsSource: SymptomItem[] = [];

  symptoms: string[] = [];
  // END Symptom

  @ViewChild('substanceInput') substanceInput: ElementRef<HTMLInputElement>;
  @ViewChild('symptomInput') symptomInput: ElementRef<HTMLInputElement>;

  // End Variables of chips

  get presentationsForm(): FormArray {
    return this.form.get('presentations') as FormArray;
  }

  form = new FormGroup({
    _brand: new FormControl(null, [Validators.required]),
    barcode: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    healthProgram: new FormControl(null),
    substances: new FormControl(null),
    symptoms: new FormControl(null),
    // min: new FormControl(null, [Validators.required]),
    // max: new FormControl(null, [Validators.required]),

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
    public orderService: OrderService,
    public toasty: ToastyService,
    public brandService: BrandService,
    public productService: ProductService,
    private symptomService: SymptomService,
    private substanceService: SubstanceService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.product) {
      this.form = new FormGroup({
        _brand: new FormControl(this.product._brand.name, [
          Validators.required,
        ]),
        barcode: new FormControl(this.product.barcode, [Validators.required]),
        description: new FormControl(this.product.description, [
          Validators.required,
        ]),
        exempt: new FormControl(this.product.exempt, [Validators.required]),

        healthProgram: new FormControl(this.product.healthProgram),
        substances: new FormControl(null),
        symptoms: new FormControl(null),
        presentations: this.formBuilder.array([]),

        // substances: new FormControl(this.product.substances),
        // symptoms: new FormControl(this.product.symptoms),
      });
      this.product.substances.forEach((sub) => {
        this.substances.push(sub.name.toString());
      });

      this.product.symptoms.forEach((sym) => {
        this.symptoms.push(sym.name.toString());
      });

      if (this.product.presentations.length > 0) {
        this.product.presentations.forEach((presentation) => {
          this.addPresentation(presentation);
        });
      }
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

    this.filteredOptions = this.form.controls._brand.valueChanges.pipe(
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

  addPresentation(presentation?: ProductPresentationsItem): void {
    const presentationFormGroup = this.formBuilder.group({
      name: new FormControl(presentation.name, [Validators.required]),
      wholesale_price: new FormControl(presentation.wholesale_price, [
        Validators.required,
      ]),
      distributor_price: new FormControl(presentation.distributor_price, [
        Validators.required,
      ]),
      retail_price: new FormControl(presentation.retail_price, [
        Validators.required,
      ]),
      cf_price: new FormControl(presentation.cf_price, [Validators.required]),
      quantity: new FormControl(presentation.quantity, [Validators.required]),
      commission: new FormControl(presentation.commission, [
        Validators.required,
      ]),
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

  // Functions to Chips
  addSubstance(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our substances
    if (value) {
      this.substances.push(value);
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
      this.symptoms.push(value);
    }
    // Clear the input value
    if (event.input) {
      event.input.value = '';
    }

    this.form.controls.symptoms.setValue(null);
  }

  removeSubstance(substance: string): void {
    const index = this.substances.indexOf(substance);

    if (index >= 0) {
      this.substances.splice(index, 1);
    }
  }

  selectedSubstance(event: MatAutocompleteSelectedEvent): void {
    this.substances.push(event.option.viewValue);
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

  removeSymptoms(symptom: string): void {
    const index = this.symptoms.indexOf(symptom);
    if (index >= 0) {
      this.symptoms.splice(index, 1);
    }
  }

  selectedSymptom(event: MatAutocompleteSelectedEvent): void {
    this.symptoms.push(event.option.viewValue);
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

  private _filterPresentations(value: string): string[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.presentationsDefault.filter((presentation) =>
        presentation.toLowerCase().includes(filterValue)
      );
    }
  }

  editProduct(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const product: ProductItem = { ...this.form.value };

    product._id = this.product._id;
    product._brand = { name: this.form.value._brand };
    product.substances = this.substances;
    product.symptoms = this.symptoms;
    product.deleted = this.product.deleted;
    product.discontinued = this.product.discontinued;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Editar Producto',
        message:
          '¿Confirma que desea Editar las propiedades del producto:  ' +
          this.product.description +
          '?',
        description: false,
      },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.loading = true;
        this.productService.updateProduct(product).subscribe(
          (res) => {
            this.product = null;
            this.toasty.success('Producto Editado exitosamente');
            this.router.navigate(['admin/adminProducts']);
          },
          (error) => {
            this.loading = false;
            this.toasty.error('Error al editar el Producto');
          }
        );
      }
      this.loading = false;
    });
  }
}
