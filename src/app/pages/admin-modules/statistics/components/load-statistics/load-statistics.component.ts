import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { CellarItem } from 'src/app/core/models/Cellar';
import { TempSaleService } from 'src/app/core/services/httpServices/temp-sale.service';
import { TempStorageService } from 'src/app/core/services/httpServices/temp-storage.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { BrandItem } from '../../../../../core/models/Brand';
import { XlsxService } from '../../../../../core/services/internal/XlsxService.service';

@Component({
  selector: 'app-load-statistics',
  templateUrl: './load-statistics.component.html',
  styleUrls: ['./load-statistics.component.scss']
})
export class LoadStatisticsComponent implements OnInit {

  loading = false;

  form = new FormGroup({
    cellar: new FormControl(undefined, Validators.required),
    brand: new FormControl(undefined, Validators.required),
    startDate: new FormControl(new Date(), Validators.required),
    endDate: new FormControl(new Date(), Validators.required),
    startDate2: new FormControl(new Date(), Validators.required),
    endDate2: new FormControl(new Date(), Validators.required),
    daysRequest: new FormControl('', Validators.required),
    supplyDays: new FormControl('', Validators.required)
  });

  // Table
  @ViewChild(MatPaginator) paginator: MatPaginator;

  data: any[] = [];
  dataSource = new MatTableDataSource();
  columns = [
    'barcode',
    'description',
    'avgSalesMonths',
    'avgSalesYear',
    'salesLastMonth',
    'avgSalesMonth',
    'avgSalesDay',
    'inventory',
    'supply',
    'aproxSupply',
    'suggestedOrder',
    'minExistence',
    'maxExistence',
  ];
  // End Table

  constructor(
    public tempStorageService: TempStorageService,
    public tempSaleService: TempSaleService,
    private toastyService: ToastyService,
    private dialog: MatDialog,
    private xlsxService: XlsxService
  ) {

  }

  ngOnInit(): void {

  }

  getCellar(cellar: CellarItem) {
    this.form.get('cellar').setValue(cellar);
  }

  getBrand(brand: BrandItem) {
    this.form.get('brand').setValue(brand);
  }

  applyFilter(filter: string) {
    this.dataSource.filter = filter

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadSettings(): void {
    if (this.form.invalid) {
      this.toastyService.error('Todos los campos son obligatorios');
      return;
    }
    this.loading = true;
    this.tempSaleService
      .getStatics(
        this.form.controls.cellar.value._id,
        this.form.controls.brand.value._id,
        this.form.controls.startDate.value,
        this.form.controls.endDate.value,
        this.form.controls.startDate2.value,
        this.form.controls.endDate2.value,
        this.form.controls.daysRequest.value,
        this.form.controls.supplyDays.value
      )
      .subscribe((res) => {
        this.data = res.tempSales;
        this.dataSource = new MatTableDataSource<any>(this.data);
        this.dataSource.paginator = this.paginator;
        /* #region  función para poder filtrar subdocumentos dentro de la tabla */
        this.dataSource.filterPredicate = (data: any, filter) => {
          const dataStr = data._id.barcode + data._id.description;
          return dataStr.trim().toLowerCase().indexOf(filter) != -1;
        }
        /* #endregion */
        this.loading = false;
      });
  }

  downloadXlsx(): void {
    if (this.data.length === 0) {
      this.toastyService.error('No hay datos para descargar, por favor realice una consulta');
      return;
    }

    const body = [
      [this.form.controls.cellar.value.name, this.form.controls.brand.value.name],
      [
        'Código',
        'Producto',
        'Promedio mes',
        'Promedio días',
        'Último mes',
        'Promedio mes (Ajustado)',
        'Promedio días (Ajustado)',
        'Inventario',
        'Provisión',
        'Provisión aprox.',
        'Pedido Sugerido',
        'Existencia Mínima',
        'Existencia Máxima'
      ]
    ];

    const ArrayToPrint: any[] = [];

    this.data.forEach(item => {
      const row: any[] = [];

      row.push(item._id.barcode);
      row.push(item._id.description);
      row.push(item.promMonth);
      row.push(item.promDays);
      row.push(item.salesMonth);
      row.push(item.promAdjustMonth);
      row.push(item.promAdjustDay);
      row.push(item.stock);
      row.push(item.supply);
      row.push(item.aproxSupply);
      row.push(item.request);
      row.push(item.minStock);
      row.push(item.maxStock);

      ArrayToPrint.push(row);
    });

    ArrayToPrint.forEach((row) => body.push(row));

    this.xlsxService.downloadSinglePage(
      body,
      'Reporte de estadísticas',
      `${this.form.controls.cellar.value.name} - ${this.form.controls.brand.value.name}`
    );
  }

  updateTempStorage(): void {
    if (this.data.length === 0) {
      this.toastyService.error('No hay cálculos generados');
      return;
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'INGRESAR A INVENTARIO',
        message:
          '¿Confirma que desea actualizar las estadisticas en la sucursal seleccionada?',
      },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.loading = true;
        this.tempStorageService.update(this.dataSource.filteredData).subscribe(resp => {
          this.toastyService.success('Inventario actualizado correctamente');
          this.loading = false;
        });
      }
    });
  }

}
