import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BrandItem } from 'src/app/core/models/Brand';
import { TempStorageService } from 'src/app/core/services/httpServices/temp-storage.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';

import { XlsxService } from '../../../../../core/services/internal/XlsxService.service';
import { CellarItem } from '../../../../../core/models/Cellar';

@Component({
  selector: 'app-consolidated',
  templateUrl: './consolidated.component.html',
  styleUrls: ['./consolidated.component.scss']
})
export class ConsolidatedComponent implements OnInit {

  loading = false;

  cellar: CellarItem;
  brand: BrandItem;
  data: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = [];
  columnsToDisplay: string[] = [];
  dataSource = new MatTableDataSource();

  constructor(
    private toastyService: ToastyService,
    private tempStorageService: TempStorageService,
    public xlsxService: XlsxService
  ) {

  }

  ngOnInit(): void {

  }

  getCellar(cellar: CellarItem) {
    this.cellar = cellar;
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
    return (name === 'CODIGO' || name === 'PRODUCTO') ? true : false
  }

  isStickyEnd(name: string): boolean {
    return (name === 'PEDIDO GLOBAL' || name === 'INVENTARIO BODEGA' || name === 'TOTAL') ? true : false
  }

  getConsolidated(): void {
    if (!this.cellar || !this.brand) {
      this.toastyService.error('Por favor seleccione una bodega y un laboratorio');
      return;
    }
    this.data = [];
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
    this.loading = true;
    this.tempStorageService.loadStockConsolidated(
      this.brand._id
    ).subscribe((resp: any) => {
      // console.log(resp);
      this.displayedColumns = []
      this.columnsToDisplay = []
      this.displayedColumns.push('CODIGO');
      this.columnsToDisplay.push('CODIGO');
      this.displayedColumns.push('PRODUCTO');
      this.columnsToDisplay.push('PRODUCTO');

      this.data = resp.map(element => {
        let row: any = {};
        row.CODIGO = element._id.barcode
        row.PRODUCTO = element._id.description

        let supplyGlobal = 0;
        let stockBodega = 0;

        element.cellars.forEach(item => {
          if (item._cellar._id === this.cellar._id) {
            // Buscamos la bodega seleccionada
            // Para mostrar su stock al final de la tabla
            stockBodega = item.stock;
          } else {
            // Agregando filas en la data
            row[item._cellar.name] = item.stock;
            supplyGlobal += item.supply;

            // Buscando si ya fueron agregadas las columnas
            const INDEX = this.displayedColumns.findIndex(c => c === item._cellar.name);
            if (INDEX < 0) {
              // Columnas por sucursales
              const COLUMN = this.displayedColumns.push(item._cellar.name);
              this.columnsToDisplay.push(item._cellar.name);
              this.displayedColumns.push(`Pedido${COLUMN}`);
              this.columnsToDisplay.push(`Pedido${COLUMN}`);
              this.displayedColumns.push(`Devoluciones${COLUMN}`);
              this.columnsToDisplay.push(`Devoluciones${COLUMN}`);
              this.displayedColumns.push(`Faltantes${COLUMN}`);
              this.columnsToDisplay.push(`Faltantes${COLUMN}`);
              row[`Pedido${COLUMN}`] = item.supply;
              if (item.stock > item.maxStock) {
                row[`Devoluciones${COLUMN}`] = +item.stock - +item.maxStock;
              } else {
                row[`Devoluciones${COLUMN}`] = 0;
              }
              if (item.stock < item.minStock) {
                row[`Faltantes${COLUMN}`] = +item.minStock - +item.stock;
              } else {
                row[`Faltantes${COLUMN}`] = 0;
              }
            } else {
              row[`Pedido${INDEX + 1}`] = item.supply;
              if (item.stock > item.maxStock) {
                row[`Devoluciones${INDEX + 1}`] = +item.stock - +item.maxStock;
              } else {
                row[`Devoluciones${INDEX + 1}`] = 0;
              }
              if (item.stock < item.minStock) {
                row[`Faltantes${INDEX + 1}`] = +item.minStock - +item.stock;
              } else {
                row[`Faltantes${INDEX + 1}`] = 0;
              }
            }
          }
        });
        row['PEDIDO GLOBAL'] = supplyGlobal;
        row['INVENTARIO BODEGA'] = stockBodega;
        row['TOTAL'] = supplyGlobal - stockBodega;

        return row;
      });
      this.displayedColumns.push('PEDIDO GLOBAL');
      this.columnsToDisplay.push('PEDIDO GLOBAL');
      this.displayedColumns.push('INVENTARIO BODEGA');
      this.columnsToDisplay.push('INVENTARIO BODEGA');
      this.displayedColumns.push('TOTAL');
      this.columnsToDisplay.push('TOTAL');
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
      [this.cellar.name, this.brand.name],
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
      'Estadísticas Consolidado',
      `${this.cellar.name} - ${this.brand.name}`
    );
  }

}
