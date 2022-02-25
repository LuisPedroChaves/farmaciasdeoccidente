import { Component, OnInit, AfterContentInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';

import { Subscription } from 'rxjs/internal/Subscription';

import { BrandItem } from 'src/app/core/models/Brand';
import { CellarItem } from 'src/app/core/models/Cellar';
import { BrandService } from 'src/app/core/services/httpServices/brand.service';
import { CellarService } from 'src/app/core/services/httpServices/cellar.service';
import { FilterPipe } from 'src/app/core/shared/pipes/filterPipes/filter.pipe';
import { ToastyService } from '../../../../../../../core/services/internal/toasty.service';
import { AutoStatisticService } from '../../../../../../../core/services/httpServices/auto-statistic.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit, AfterContentInit, OnDestroy {

  @Output() close = new EventEmitter();
  loading = false;

  /* #region  mat-step 1 */
  form1: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    hour: new FormControl('', Validators.required),
    minute: new FormControl('', Validators.required),
    cellars: new FormControl(null, Validators.required),
  })

  hours: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
  minutes: number[] = [0, 10, 20, 30, 40, 50]

  cellarsSubscription: Subscription;
  cellars: CellarItem[];
  selectedAll = false;
  /* #endregion */

  /* #region  mat-step 2 */
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;

  brandsSubscription: Subscription;
  brands: BrandItem[];
  brandsPage: BrandItem[];
  // Pagination
  start: number = 0
  end: number = 24

  // My selected Brands
  selectedBrands: BrandItem[] = [];
  selectedBrandsPage: BrandItem[] = [];
  // Pagination
  start2: number = 0
  end2: number = 24
  /* #endregion */

  form3: FormGroup = new FormGroup({
    daysRequest: new FormControl(null, Validators.required),
    daysSupply: new FormControl(null, Validators.required),
    note: new FormControl(''),
    activated: new FormControl(true, Validators.required),
  })

  constructor(
    private cellarService: CellarService,
    private brandService: BrandService,
    private filter: FilterPipe,
    private toastyService: ToastyService,
    private autoStatisticService: AutoStatisticService
  ) {
    this.cellarsSubscription = this.cellarService
      .readData()
      .subscribe((data: CellarItem[]) => {
        this.cellars = data;
        this.cellars = this.cellars.filter(c => c.type !== 'BODEGA');
        this.selectAllCellars();
        this.selectedAll = true;
      });
    this.brandsSubscription = this.brandService.readData().subscribe((data) => {
      this.brands = data;
      this.brandsPage = this.brands.slice(this.start, this.end);
    });
  }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    this.cellarService.loadData();
    this.brandService.loadData();
  }

  ngOnDestroy(): void {
    this.cellarsSubscription?.unsubscribe();
    this.brandsSubscription?.unsubscribe();
  }

  selectAllCellars() {
    if (!this.selectedAll) {
      let valueCellarsControl: string[] = [];
      this.cellars.forEach(c => {
        valueCellarsControl.push(c._id);
      });
      this.form1.controls.cellars.setValue(valueCellarsControl);
    } else {
      this.form1.controls.cellars.setValue([]);
    }
  }

  /* #region  mat-step 2 */

  applyFilter(text: string) {
    if (text.length > 0) {
      // Si el valor enviado no es vacio
      // realiza la busqueda
      this.brandsPage = this.filter.transform(this.brands, text, ['name']);
    } else {
      // Sino entonces resetea el listado a la pagina 1
      this.brandsPage = this.brands.slice(this.start, this.end);
    }
    if (this.paginator1) {
      this.paginator1.firstPage();
    }
  }

  applyFilter2(text: string) {
    if (text.length > 0) {
      // Si el valor enviado no es vacio
      // realiza la busqueda
      this.selectedBrandsPage = this.filter.transform(this.selectedBrands, text, ['name']);
    } else {
      // Sino entonces resetea el listado a la pagina 1
      this.selectedBrandsPage = this.selectedBrands.slice(this.start2, this.end2);
    }
    if (this.paginator2) {
      this.paginator2.firstPage();
    }
  }

  onPageChange($event) {
    this.start = $event.pageIndex * $event.pageSize;
    this.end = $event.pageIndex * $event.pageSize + $event.pageSize;
    this.brandsPage = this.brands.slice(this.start, this.end);
  }

  onPageChange2($event) {
    this.start2 = $event.pageIndex * $event.pageSize;
    this.end2 = $event.pageIndex * $event.pageSize + $event.pageSize;
    this.selectedBrandsPage = this.selectedBrands.slice(this.start2, this.end2);
  }

  selectBrand(brand: BrandItem) {
    const SELECTED_INDEX = this.selectedBrands.findIndex(b => b._id === brand._id);

    if (SELECTED_INDEX > -1) {
      // Sí encuentra el index entonces ya fue seleccionada
      return;
    }

    if (this.end2 >= this.selectedBrands.length) {
      this.selectedBrandsPage.push(brand);
    }
    this.selectedBrands.push(brand);

    brand.selected = true;
    this.selectedBrand(brand);
  }

  removeBrand(brand: BrandItem) {
    const SELECTED_INDEX = this.selectedBrands.findIndex(b => b._id === brand._id)
    const SELECTED_INDEX_PAGE = this.selectedBrandsPage.findIndex(b => b._id === brand._id)

    if (SELECTED_INDEX > -1) {
      this.selectedBrands = this.selectedBrands.filter(b => b._id !== brand._id)
    }
    if (SELECTED_INDEX_PAGE > -1) {
      this.selectedBrandsPage = this.selectedBrandsPage.filter(b => b._id !== brand._id)
      this.selectedBrandsPage.splice(SELECTED_INDEX_PAGE, 1)
      if (this.selectedBrandsPage.length === 0) {
        this.paginator2.firstPage();
      }
    }

    // Desmarcamos la brand del listado principal
    brand.selected = false;
    this.selectedBrand(brand);
  }

  selectedBrand(brand: BrandItem) {
    //Marcamos la brand del listado principal
    const INDEX = this.brands.findIndex(b => b._id === brand._id)
    const INDEX_PAGE = this.brandsPage.findIndex(b => b._id === brand._id)
    if (INDEX > -1) {
      this.brands[INDEX] = brand;
    }
    if (INDEX_PAGE > -1) {
      this.brandsPage[INDEX_PAGE] = brand;
    }
  }

  selectAll() {
    this.brands.forEach(b => this.selectBrand(b))
  }

  removeAll() {
    this.selectedBrands.forEach(b => this.removeBrand(b))
  }

  checkBrands() {
    if (this.selectedBrands.length === 0) {
      this.toastyService.toasty('warning', 'No hay laboratorios seleccionados');
      return
    }
  }
  /* #endregion */

  saveAutoStatistic() {
    this.loading = true;
    this.autoStatisticService.create({
      ...this.form1.value,
      brands: this.selectedBrands,
      ...this.form3.value
    }).subscribe(resp => {
      this.toastyService.success('Configuración automática creada exitosamente')
      this.loading = false;
      this.close.emit();
      this.autoStatisticService.loadData();
    });
  }
}
