import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CardexItem } from 'src/app/core/models/Kardex';
import { LoteDetailsComponent } from '../lote-details/lote-details.component';

@Component({
  selector: 'app-kardex-income',
  templateUrl: './kardex-income.component.html',
  styleUrls: ['./kardex-income.component.scss'],
})
export class KardexIncomeComponent implements OnInit, AfterViewInit {
  smallScreen = window.innerWidth < 960 ? true : false;

  displayedColumnsIncome: string[] = [
    'lote',
    'date',
    'action',
    'source',
    'destiny',
    'quantity',
  ];

  dataSource = new MatTableDataSource<CardexItem>(Income);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  showLote(item: any): void {
    const dialogRef = this.dialog.open(LoteDetailsComponent, {
      width: this.smallScreen ? '100%' : '30%',
      data: {
        idLote: item.id,
        currentStore: item.store,
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
}

const Income: CardexItem[] = [
  {
    lote: 11,
    date: '12/05/2021',
    action: 'Compra',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 50,
  },
  {
    lote: 12,
    date: '12/05/2021',
    action: 'Compra',
    source: 'Sucursal: Farmacia',
    destiny: 'Bodega Central',
    quantity: 50,
  },
  {
    lote: 13,
    date: '12/05/2021',
    action: 'Compra',
    source: 'Sucursal: Farmacia 4',
    destiny: 'Bodega Central',
    quantity: 50,
  },
  {
    lote: 14,
    date: '12/05/2021',
    action: 'Compra',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 50,
  },
  {
    lote: 15,
    date: '12/05/2021',
    action: 'Compra',
    source: 'Bodega Central',
    destiny: 'Sucursal: Farmacia 2',
    quantity: 50,
  },
  {
    lote: 16,
    date: '12/05/2021',
    action: 'Compra',
    source: 'Sucursal: Farmacia 2',
    destiny: 'Sucursal: Pradera',
    quantity: 50,
  },
  {
    lote: 17,
    date: '12/05/2021',
    action: 'Compra',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 50,
  },
  {
    lote: 18,
    date: '12/05/2021',
    action: 'Compra',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 50,
  },
  {
    lote: 19,
    date: '12/05/2021',
    action: 'Compra',
    source: 'Sucursal: Farmacia 1',
    destiny: 'Bodega Central',
    quantity: 50,
  },
  {
    lote: 20,
    date: '12/05/2021',
    action: 'Compra',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 50,
  },
];
