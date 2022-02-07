import { Component, OnInit, ViewChild, AfterContentInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';

import { Subscription } from 'rxjs';

import { BrandItem } from 'src/app/core/models/Brand';
import { BrandService } from 'src/app/core/services/httpServices/brand.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { FilterPipe } from 'src/app/core/shared/pipes/filterPipes/filter.pipe';
import { XlsxService } from '../../../../../core/services/internal/XlsxService.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, AfterContentInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatDrawer) drawer: MatDrawer;

  searchText: string;

  brandsSubscription: Subscription;
  brands: BrandItem[];
  brandsPage: BrandItem[];

  brandForm = new FormGroup({
    _id: new FormControl(null),
    name: new FormControl('', Validators.required)
  });

  // Pagination
  start: number = 0
  end: number = 24

  constructor(
    private brandService: BrandService,
    private filter: FilterPipe,
    public toastyService: ToastyService,
    private xlsxService: XlsxService
  ) { }

  ngOnInit(): void {
    this.brandsSubscription = this.brandService.readData().subscribe((data) => {
      this.brands = data;
      this.brandsPage = this.brands.slice(this.start, this.end);
    });
  }

  ngAfterContentInit(): void {
    this.brandService.loadData();
  }

  ngOnDestroy(): void {
    this.brandsSubscription?.unsubscribe();
  }

  applyFilter(text: string) {
    if (text.length > 0) {
      // Si el valor enviado no es vacio
      // realiza la busqueda
      this.brandsPage = this.filter.transform(this.brands, text, ['name']);
    } else {
      // Sino entonces resetea el listado a la pagina 1
      this.brandsPage = this.brands.slice(this.start, this.end);
    }
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  onPageChange($event) {
    this.start = $event.pageIndex * $event.pageSize;
    this.end = $event.pageIndex * $event.pageSize + $event.pageSize;
    this.brandsPage = this.brands.slice(this.start, this.end);
  }

  newBrand() {
    this.drawer.toggle()
    this.brandForm.reset();
  }

  editBrand(brand: BrandItem) {
    this.drawer.toggle()
    this.brandForm.controls._id.setValue(brand._id);
    this.brandForm.controls.name.setValue(brand.name);
  }

  pushBrand(brand: BrandItem) {
    // Buscamos que el laboratorio se encuentre visible en la pagina actual
    const INDEX_PAGE = this.brandsPage.findIndex(b => b._id === brand._id);
    // Buscamos el laboratorio en el listado general por si se esta editando
    const INDEX = this.brands.findIndex(b => b._id === brand._id);
    if (INDEX > -1) {
      if (INDEX_PAGE > -1) {
        // Si se encuentra visible en la pagina actual entonces lo remplaza
        this.brandsPage[INDEX_PAGE] = brand;
      }
      this.brands[INDEX] = brand;
    } else {
      if (this.end >= this.brands.length) {
        this.brandsPage.push(brand);
      }
      this.brands.push(brand);
    }
  }

  removeBrand(_id: string) {
    this.brands = this.brands.filter(b => {
      return b._id !== _id
    })
    this.brandsPage = this.brandsPage.filter(b => {
      return b._id !== _id
    })
  }

  downloadXlsx(): void {

    const body = [
      ['Catálogo de Laboratorios'],
      ['Código','Nombre']
    ];

    const ArrayToPrint: any[] = [];

    this.brands.forEach(item => {
      const row: any[] = [];

      row.push(item['code']);
      row.push(item['name']);

      ArrayToPrint.push(row);
    });

    ArrayToPrint.forEach((row) => body.push(row));

    this.xlsxService.downloadSinglePage(
      body,
      'Catálogo de Laboratorios',
      'Catálogo de Laboratorios'
    );
  }
}
