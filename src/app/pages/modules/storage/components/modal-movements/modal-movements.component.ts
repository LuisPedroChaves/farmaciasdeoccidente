import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-modal-movements',
  templateUrl: './modal-movements.component.html',
  styleUrls: ['./modal-movements.component.scss'],
})
export class ModalMovementsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'lote',
    'date',
    'action',
    'source',
    'destiny',
    'quantity',
  ];
  displayedColumnsIncome: string[] = [
    'lote',
    'date',
    'action',
    'source',
    'destiny',
    'quantity',
  ];
  dataSource = new MatTableDataSource<CardexItem>(Outcome);
  dataSource2 = new MatTableDataSource<CardexItem>(Income);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginator2: MatPaginator;

  constructor(public dialogRef: MatDialogRef<ModalMovementsComponent>) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource2.paginator = this.paginator2;
  }
}

export interface CardexItem {
  lote: number;
  date: string;
  action: string;
  source: string;
  destiny: string;
  quantity: number;
}

const Outcome: CardexItem[] = [
  {
    lote: 1,
    date: '12/05/2021',
    action: 'Traslado',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 50,
  },
  {
    lote: 2,
    date: '12/05/2021',
    action: 'Traslado',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 50,
  },
  {
    lote: 3,
    date: '12/05/2021',
    action: 'Traslado',
    source: 'Sucursal: Centro',
    destiny: 'Bodega Central',
    quantity: 50,
  },
  {
    lote: 4,
    date: '12/05/2021',
    action: 'Traslado',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 50,
  },
  {
    lote: 5,
    date: '12/05/2021',
    action: 'Traslado',
    source: 'Sucursal: Centro',
    destiny: 'Bodega Central',
    quantity: 50,
  },
  {
    lote: 6,
    date: '12/05/2021',
    action: 'Traslado',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 50,
  },
  {
    lote: 7,
    date: '12/05/2021',
    action: 'Traslado',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 50,
  },
  {
    lote: 8,
    date: '12/05/2021',
    action: 'Traslado',
    source: 'Bodega Central',
    destiny: 'Sucursal: Pradera',
    quantity: 50,
  },
  {
    lote: 9,
    date: '12/05/2021',
    action: 'Traslado',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 50,
  },
  {
    lote: 10,
    date: '12/05/2021',
    action: 'Traslado',
    source: 'Sucursal: Farmacia 1',
    destiny: 'Bodega Central',
    quantity: 50,
  },
];

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
