import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BrandItem } from 'src/app/core/models/Brand';
import { ProductItem } from 'src/app/core/models/Product';
import { StorageItem } from 'src/app/core/models/Storage';
import { BrandService } from 'src/app/core/services/httpServices/brand.service';
import { ProductService } from 'src/app/core/services/httpServices/product.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { AppState } from 'src/app/core/store/app.reducer';
import { ModalMovementsComponent } from '../modal-movements/modal-movements.component';

@Component({
  selector: 'app-pending-inventory',
  templateUrl: './pending-inventory.component.html',
  styleUrls: ['./pending-inventory.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class PendingInventoryComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  // Autocomplete Brand
  orderFind = false;
  brandsSubscription: Subscription;
  brands: BrandItem[];
  brandOptions: BrandItem[] = [];
  brandFilteredOptions: Observable<BrandItem[]>;
  // END brand

  searchBy = 'Producto';
  smallScreen = window.innerWidth < 960 ? true : false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  expandedElement: ProductItem | null;

  sessionsubscription: Subscription;
  productsp: string[];
  dataSource = storageItems;
  // dataSource: ProductsDataSource;
  columns = [
    'code',
    'description',
    '_brand',
    'healthProgram',
    'totalStock',
    'state',
    // 'options',
  ];
  currentPage = 0;

  searchBrandField = new FormControl();
  searchProductField = new FormControl();

  constructor(
    public store: Store<AppState>,
    public toasty: ToastyService,
    public router: Router,
    public dialog: MatDialog,
    public productService: ProductService,
    public brandService: BrandService
  ) {}

  ngOnInit(): void {
    // Brand Autocomplete
    this.brandsSubscription = this.brandService.readData().subscribe((data) => {
      this.brands = data;
      this.brandOptions = [...this.brands];
    });
    this.brandFilteredOptions = this.searchBrandField.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterBrands(value))
    );
    // END Brand AUtocomplete
    console.log(this.dataSource);
  }
  ngOnDestroy(): void {
    this.sessionsubscription?.unsubscribe();
    this.brandsSubscription?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.brandService.loadData();
  }
  private _filterBrands(value: string): BrandItem[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.brandOptions.filter((option) =>
        option.name.toLowerCase().includes(filterValue)
      );
    } else {
      return [];
    }
  }

  showMovements(item: any): void {
    const dialogRef = this.dialog.open(ModalMovementsComponent, {
      width: this.smallScreen ? '100%' : '1200px',
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
        // this.loadProducts();
      }
    });
  }

  filterByBrand(brandName: string): void {
    console.log(brandName);
  }

  searchByProduct(productName: string): void {
    console.log(productName);
  }

  changeSearch(): void {
    if (this.searchBy === 'Producto') {
      this.searchBy = 'Laboratorio';
      this.searchBrandField.setValue('');
      this.searchProductField.setValue('');
    } else {
      this.searchBy = 'Producto';
      this.searchBrandField.setValue('');
      this.searchProductField.setValue('');
    }
  }
}
const storageItems: StorageItem[] = [
  {
    _id: '01',
    product: {
      barcode: '145',
      code: '1325',
      deleted: false,
      description: 'Medicamento04',
      discontinued: false,
      exempt: false,
      healthProgram: 'Se regala una pastilla extra',
      // lastUpdate: null,
      presentations: [
        {
          cf_price: 9.5,
          commission: 1.2,
          // cost: 0,
          distributor_price: 7.5,
          name: 'UNIDAD',
          quantity: 1,
          retail_price: 8.5,
          wholesale_price: 6.5,
          _id: '6148fcd14ba6963840cc36b4',
          cost: 0,
        },
        {
          cf_price: 4.5,
          commission: 0.5,
          // cost: 0,
          distributor_price: 2.5,
          name: 'CAJA',
          quantity: 25,
          retail_price: 3.5,
          wholesale_price: 1.5,
          _id: '6148fcd14ba6963840cc36b5',
          cost: 0,
        },
      ],
      substances: [
        {
          // deleted: false,
          name: 'ACIDOLACTICO',
          _id: '6138edac8cc1be1e7027f3ab',
        },
        {
          // deleted: false,
          name: 'CATETER',
          _id: '6138f0698cc1be1e70282df6',
        },
        {
          // deleted: false,
          _id: '6138ef998cc1be1e70281cc9',
          name: 'ACEITERECINO',
        },
      ],

      symptoms: [
        {
          // deleted: false,
          name: 'TOS',
          _id: '61415a7a3211244080034475',
        },
        {
          // deleted: false,
          name: 'FIEBRE',
          _id: '61415a7a3211244080034474',
        },
      ],
      _brand: {
        // deleted: false,
        name: 'DENKPHARMAALEMANIA',
        _id: '60f6143b40a6912b201bfa7a',
      },
      _id: '6142bdda321124408003447c',
    },
    cellar: {
      _id: '6142bdda321124408003447c',
      name: 'something',
      address: 'Huehuetenango',
      description: 'Huehuetenango',
      type: 'nose',
    },
    minStock: 10,
    maxStock: 25,
    cost: 2.5,
    totalStock: 15,
    reserve: 'string',
    isNew: true,
    isMissing: false,
    state: true,
  },
  {
    _id: '02',
    product: {
      barcode: '145',
      code: '1478',
      deleted: false,
      description: 'Medicamento10',
      discontinued: true,
      exempt: false,
      healthProgram: 'Se regala una pastilla extra',
      // lastUpdate: null,
      presentations: [
        {
          cf_price: 9.5,
          commission: 1.2,
          // cost: 0,
          distributor_price: 7.5,
          name: 'UNIDAD',
          quantity: 1,
          retail_price: 8.5,
          wholesale_price: 6.5,
          _id: '6148fcd14ba6963840cc36b4',
          cost: 0,
        },
        {
          cf_price: 4.5,
          commission: 0.5,
          // cost: 0,
          distributor_price: 2.5,
          name: 'CAJA',
          quantity: 25,
          retail_price: 3.5,
          wholesale_price: 1.5,
          _id: '6148fcd14ba6963840cc36b5',
          cost: 0,
        },
      ],
      substances: [
        {
          // deleted: false,
          name: 'ACIDOLACTICO',
          _id: '6138edac8cc1be1e7027f3ab',
        },
        {
          // deleted: false,
          name: 'CATETER',
          _id: '6138f0698cc1be1e70282df6',
        },
        {
          // deleted: false,
          _id: '6138ef998cc1be1e70281cc9',
          name: 'ACEITERECINO',
        },
      ],

      symptoms: [
        {
          // deleted: false,
          name: 'TOS',
          _id: '61415a7a3211244080034475',
        },
        {
          // deleted: false,
          name: 'FIEBRE',
          _id: '61415a7a3211244080034474',
        },
      ],
      _brand: {
        // deleted: false,
        name: 'DENKPHARMAALEMANIA',
        _id: '60f6143b40a6912b201bfa7a',
      },
      _id: '6142bdda321124408003447c',
    },
    cellar: {
      _id: '6142bdda321124408003447c',
      name: 'something',
      address: 'Huehuetenango',
      description: 'Huehuetenango',
      type: 'nose',
    },
    minStock: 0,
    maxStock: 0,
    cost: 2.5,
    totalStock: 55,
    reserve: 'string',
    isNew: false,
    isMissing: false,
    state: true,
  },
  {
    _id: '03',
    product: {
      barcode: '145',
      code: '4569',
      deleted: false,
      description: 'Medicamento16',
      discontinued: false,
      exempt: false,
      healthProgram: 'Se regala una pastilla extra',
      // lastUpdate: null,
      presentations: [
        {
          cf_price: 9.5,
          commission: 1.2,
          // cost: 0,
          distributor_price: 7.5,
          name: 'UNIDAD',
          quantity: 1,
          retail_price: 8.5,
          wholesale_price: 6.5,
          _id: '6148fcd14ba6963840cc36b4',
          cost: 0,
        },
        {
          cf_price: 4.5,
          commission: 0.5,
          // cost: 0,
          distributor_price: 2.5,
          name: 'CAJA',
          quantity: 25,
          retail_price: 3.5,
          wholesale_price: 1.5,
          _id: '6148fcd14ba6963840cc36b5',
          cost: 0,
        },
      ],
      substances: [
        {
          // deleted: false,
          name: 'ACIDOLACTICO',
          _id: '6138edac8cc1be1e7027f3ab',
        },
        {
          // deleted: false,
          name: 'CATETER',
          _id: '6138f0698cc1be1e70282df6',
        },
        {
          // deleted: false,
          _id: '6138ef998cc1be1e70281cc9',
          name: 'ACEITERECINO',
        },
      ],

      symptoms: [
        {
          // deleted: false,
          name: 'TOS',
          _id: '61415a7a3211244080034475',
        },
        {
          // deleted: false,
          name: 'FIEBRE',
          _id: '61415a7a3211244080034474',
        },
      ],
      _brand: {
        // deleted: false,
        name: 'DENKPHARMAALEMANIA',
        _id: '60f6143b40a6912b201bfa7a',
      },
      _id: '6142bdda321124408003447c',
    },
    cellar: {
      _id: '6142bdda321124408003447c',
      name: 'something',
      address: 'Huehuetenango',
      description: 'Huehuetenango',
      type: 'nose',
    },
    minStock: 10,
    maxStock: 100,
    cost: 2.5,
    totalStock: 5,
    reserve: 'string',
    isNew: false,
    isMissing: false,
    state: true,
  },
];
