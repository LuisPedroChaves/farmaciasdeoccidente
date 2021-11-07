import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CardexItem } from 'src/app/core/models/Kardex';

@Component({
  selector: 'app-activity-inventory',
  templateUrl: './activity-inventory.component.html',
  styleUrls: ['./activity-inventory.component.scss'],
})
export class ActivityInventoryComponent implements OnInit, AfterViewInit {
  smallScreen = window.innerWidth < 960 ? true : false;

  displayedColumnsActivity: string[] = [
    'lote',
    'date',
    'income',
    'outcome',
    'residue',
    'source',
    'destiny',
    'quantity',
  ];
  dataSource = new MatTableDataSource<CardexItem>(movements);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}

const movements: CardexItem[] = [
  {
    lote: 11,
    date: '12/05/2021',
    action: 'IN',
    detail: 'Compra',
    source: 'Proveedor N',
    destiny: 'Bodega Central',
    quantity: 100,
    residue: 45,
  },
  {
    lote: 11,
    date: '12/05/2021',
    action: 'IN',
    detail: 'Traslado',
    source: 'Sucursal: Farmacia',
    destiny: 'Bodega Central',
    quantity: 50,
    residue: 45,
  },
  {
    lote: 11,
    date: '12/05/2021',
    action: 'OUT',
    detail: '',
    source: 'Sucursal: Farmacia 4',
    destiny: 'Bodega Central',
    quantity: 50,
    residue: 45,
  },
  {
    lote: 54,
    date: '12/05/2021',
    action: 'IN',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 50,
    residue: 45,
  },
  {
    lote: 54,
    date: '12/05/2021',
    action: 'IN',
    source: 'Bodega Central',
    destiny: 'Sucursal: Farmacia 2',
    quantity: 50,
    residue: 45,
  },
  {
    lote: 75,
    date: '12/05/2021',
    action: 'IN',
    source: 'Sucursal: Farmacia 2',
    destiny: 'Sucursal: Pradera',
    quantity: 50,
    residue: 45,
  },
  {
    lote: 75,
    date: '12/05/2021',
    action: 'OUT',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 50,
    residue: 45,
  },
  {
    lote: 75,
    date: '12/05/2021',
    action: 'OUT',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 50,
    residue: 45,
  },
  {
    lote: 19,
    date: '12/05/2021',
    action: 'OUT',
    detail: 'traslado',
    source: 'Sucursal: Farmacia 1',
    destiny: 'Bodega Central',
    quantity: 50,
    residue: 45,
  },
  {
    lote: 19,
    date: '12/05/2021',
    action: 'OUT',
    detail: 'traslado',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 50,
    residue: 45,
  },
];
