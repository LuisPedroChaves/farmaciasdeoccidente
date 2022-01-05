import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { BrandItem } from 'src/app/core/models/Brand';
import { BrandService } from '../../../../../core/services/httpServices/brand.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { TempStorageService } from '../../../../../core/services/httpServices/temp-storage.service';
import { XlsxService } from '../../../../../core/services/internal/XlsxService.service';

@Component({
  selector: 'app-stock-consolidated',
  templateUrl: './stock-consolidated.component.html',
  styleUrls: ['./stock-consolidated.component.scss']
})
export class StockConsolidatedComponent implements OnInit, OnDestroy {

  loading = false;

  brandsSubscription: Subscription;
  brands: BrandItem[];
  options: BrandItem[] = [];
  filteredOptions: Observable<BrandItem[]>;

  FORM = new FormGroup({
    _brand: new FormControl(),
  });

  DATA: any[] = [];

  displayedColumns: string[] = [];
  columnsToDisplay: string[] = [];
  dataSource = new MatTableDataSource();

  constructor(
    private brandService: BrandService,
    private toastyService: ToastyService,
    private tempStorageService: TempStorageService,
    private xlsxService: XlsxService
  ) { }

  ngOnInit(): void {
    this.brandsSubscription = this.brandService.readData().subscribe((data) => {
      this.brands = data;
      this.options = [...this.brands];
    });
    this.filteredOptions = this.FORM.controls._brand.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterBrands(value))
    );
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isSticky(name: string): boolean {
    return (name === 'Código' || name === 'Producto' || name === 'Costo (Q)') ? true : false
  }

  isStickyEnd(name: string): boolean {
    return (name === 'INVENTARIO GLOBAL' || name === 'TOTAL GLOBAL (Q)') ? true : false
  }

  getConsolidated(): void {
    const BRAND = this.brands.find(
      (e) => e.name === this.FORM.controls._brand.value
    );
    if (BRAND) {
      this.loading = true;
      this.tempStorageService.loadStockConsolidated(
        BRAND._id
      ).subscribe((resp: any) => {
        // console.log(resp);
        this.displayedColumns = []
        this.columnsToDisplay = []
        this.displayedColumns.push('Código');
        this.columnsToDisplay.push('Código');
        this.displayedColumns.push('Producto');
        this.columnsToDisplay.push('Producto');
        this.displayedColumns.push('Costo (Q)');
        this.columnsToDisplay.push('Costo (Q)');
        let countColumn = 3;
        this.DATA = resp.map(element => {
          let row: any = {};
          row.Código = element._id.barcode
          row.Producto = element._id.description
          let cost: number = 0;
          if (element._id.presentations.length > 0) {
            cost = element._id.presentations[0].cost.toFixed(2)
          }
          row[`Costo (Q)`] = `${cost}`

          let stockGlobal = 0;
          element.cellars.forEach(item => {
            // Agregando filas en la data
            row[item._cellar.name] = item.stock;
            stockGlobal += item.stock;

            // Buscando si ya fueron agregadas las columnas
            const INDEX = this.displayedColumns.findIndex(c => c === item._cellar.name);
            if (INDEX < 0) {
              // Columnas por sucursales
              const COLUMN = this.displayedColumns.push(item._cellar.name);
              this.columnsToDisplay.push(item._cellar.name);
              this.displayedColumns.push(`Total${COLUMN} (Q)`);
              this.columnsToDisplay.push(`Total${COLUMN} (Q)`);
              row[`Total${COLUMN} (Q)`] = (item.stock * cost).toFixed(2);
              countColumn++
            } else {
              row[`Total${INDEX + 1} (Q)`] = (item.stock * cost).toFixed(2);
            }
          });
          row['INVENTARIO GLOBAL'] = stockGlobal;
          row['TOTAL GLOBAL (Q)'] = (stockGlobal * cost).toFixed(2);

          return row;
        });
        this.displayedColumns.push('INVENTARIO GLOBAL');
        this.columnsToDisplay.push('INVENTARIO GLOBAL');
        this.displayedColumns.push('TOTAL GLOBAL (Q)');
        this.columnsToDisplay.push('TOTAL GLOBAL (Q)');
        this.dataSource = new MatTableDataSource<any>(this.DATA);
        this.loading = false;
      });
    } else {
      this.toastyService.error('Debe seleccionar un laboratorio');
    }
  }

  downloadXlsx(): void {
    if (this.DATA.length === 0) {
      this.toastyService.error('No hay datos para descargar, por favor realice una consulta');
      return;
    }
    const BRAND = this.brands.find(
      (e) => e.name === this.FORM.controls._brand.value
    );
    if (BRAND) {
      const body = [
        [BRAND.name],
        this.displayedColumns
      ];

      const ArrayToPrint: any[] = [];

      this.DATA.forEach(item => {
        const row: any[] = [];

        this.displayedColumns.forEach(column => {
          row.push(item[column]);
        });

        ArrayToPrint.push(row);
      });

      ArrayToPrint.forEach((row) => body.push(row));

      this.xlsxService.downloadSinglePage(
        body,
        'Inventario Consolidado',
        BRAND.name
      );
    }else {
      this.toastyService.error('No hay un laboratorio seleccionado');
      return;
    }
  }

}
