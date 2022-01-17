import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { BrandItem } from 'src/app/core/models/Brand';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { TempStorageService } from '../../../../../core/services/httpServices/temp-storage.service';
import { XlsxService } from '../../../../../core/services/internal/XlsxService.service';

@Component({
  selector: 'app-stock-consolidated',
  templateUrl: './stock-consolidated.component.html',
  styleUrls: ['./stock-consolidated.component.scss']
})
export class StockConsolidatedComponent implements OnInit {

  loading = false;

  brand: BrandItem;
  withStock: boolean = false;
  data: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = [];
  columnsToDisplay: string[] = [];
  dataSource = new MatTableDataSource();

  constructor(
    private toastyService: ToastyService,
    private tempStorageService: TempStorageService,
    private xlsxService: XlsxService
  ) { }

  ngOnInit(): void {
  }

  getBrand(brand: BrandItem) {
    this.brand = brand;
  }

  applyFilter(filter: string) {
    this.dataSource.filter = filter

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isSticky(name: string): boolean {
    return (name === 'Código' || name === 'Producto' || name === 'Costo (Q)') ? true : false
  }

  isStickyEnd(name: string): boolean {
    return (name === 'INVENTARIO GLOBAL' || name === 'TOTAL GLOBAL (Q)') ? true : false
  }

  getConsolidated(): void {
    this.data = [];
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
    this.loading = true;
    this.tempStorageService.loadStockConsolidated(
      this.brand ? this.brand._id : 'null',
      this.withStock
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
      this.data = resp.map(element => {
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
      this.dataSource = new MatTableDataSource<any>(this.data);
      this.dataSource.paginator = this.paginator;
      this.loading = false;
    });
  }

  downloadXlsx(): void {
    if (this.data.length === 0) {
      this.toastyService.error('No hay datos para descargar, por favor realice una consulta');
      return;
    }
    const body = [
      [this.brand ? this.brand.name : 'Todos'],
      this.displayedColumns
    ];

    const ArrayToPrint: any[] = [];

    this.data.forEach(item => {
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
      this.brand ? this.brand.name : 'Todos'
    );
  }

}
