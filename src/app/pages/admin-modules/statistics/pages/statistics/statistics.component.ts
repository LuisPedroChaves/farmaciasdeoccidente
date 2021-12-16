import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { BrandItem } from 'src/app/core/models/Brand';
import { CellarItem } from 'src/app/core/models/Cellar';
import { CellarService } from '../../../../../core/services/httpServices/cellar.service';
import { BrandService } from '../../../../../core/services/httpServices/brand.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { TempStorageService } from '../../../../../core/services/httpServices/temp-storage.service';
import { XlsxService } from '../../../../../core/services/internal/XlsxService.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  smallScreen = window.innerWidth < 960 ? true : false;
  loading = false;

  cellarsSubscription: Subscription;
  centrals: CellarItem[];

  brandsSubscription: Subscription;
  brands: BrandItem[];
  options: BrandItem[] = [];
  filteredOptions: Observable<BrandItem[]>;
  currentCellar3: string;
  range = new FormGroup({
    _brand: new FormControl(),
  });

  constructor(
    public cellarService: CellarService,
    public brandService: BrandService,
    public toastyService: ToastyService,
    public tempStorageService: TempStorageService,
    public xlsxService: XlsxService
  ) {
    this.cellarsSubscription = this.cellarService
      .readData()
      .subscribe((data) => {
        this.centrals = data.filter(c => c.type === 'BODEGA');
      });
  }

  ngOnInit(): void {
    this.brandsSubscription = this.brandService.readData().subscribe((data) => {
      this.brands = data;
      this.options = [...this.brands];
    });
    this.filteredOptions = this.range.controls._brand.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterBrands(value))
    );
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

  getConsolidated(): void {
    if (!this.currentCellar3) {
      this.toastyService.error('Debe seleccionar una sucursal');
      return;
    }
    const BRAND = this.brands.find(
      (e) => e.name === this.range.controls._brand.value
    );
    if (BRAND) {
      this.loading = true;
      this.tempStorageService.loadConsolidated(
        this.currentCellar3,
        BRAND._id
      ).subscribe((resp: any) => {
        console.log(resp);
        const body = [
          [BRAND.name],
          ['Código', 'Producto'],
        ];

        const ArrayToPrint: any[] = [];

        let bandera = true;
        resp.forEach(item => {

          let suma = 0;
          const row: any[] = [
            item.barcode,
            item.description
          ];

          item.results.forEach(storage => {
            if (bandera) {
              body[1].push('Sucursal');
              body[1].push('Inventario');
              body[1].push('Pedido');
              body[1].push('Devoluciones');
              body[1].push('Faltantes');
            }

            row.push(storage.cellar)
            row.push(storage.stock)
            row.push(storage.supply)
            suma += storage.supply;

            if (storage.stock > storage.maxStock) {
              row.push(+storage.stock - +storage.maxStock)
            } else {
              row.push(0);
            }
            if (storage.stock < storage.minStock) {
              row.push(+storage.minStock - +storage.stock);
            } else {
              row.push(0);
            }
          });
          bandera = false;

          row.push(suma);
          row.push(item.stockCellar);
          row.push(+suma - +item.stockCellar);

          ArrayToPrint.push(row);
        });
        body[1].push('SUBTOTAL');
        body[1].push('BODEGA');
        body[1].push('TOTAL');

        ArrayToPrint.forEach((row) => body.push(row));

        this.xlsxService.downloadSinglePage(
          body,
          'Inventario Consolidado',
          BRAND.name
        );
        this.loading = false;
      });
    }else {
      this.toastyService.error('Debe seleccionar un laboratorio');
    }
  }

}
