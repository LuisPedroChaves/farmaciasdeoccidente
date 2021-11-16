import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CardexItem } from 'src/app/core/models/Kardex';
import { LoteItem } from 'src/app/core/models/Lote';

@Component({
  selector: 'app-lote-details',
  templateUrl: './lote-details.component.html',
  styleUrls: ['./lote-details.component.scss'],
})
export class LoteDetailsComponent implements OnInit, AfterViewInit {
  smallScreen = window.innerWidth < 960 ? true : false;

  showMovements = false;
  loteExample = loteExample;

  movements = LoteMovements;

  displayedColumnsActivity: string[] = [
    'lote',
    'date',
    'source',
    'destiny',
    'income',
    'outcome',
    'residue',
  ];

  dataMovements = new MatTableDataSource<CardexItem>(this.movements);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<LoteDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.showMovements = this.data.showLoteMovements;
  }
  ngAfterViewInit(): void {
    this.dataMovements.paginator = this.paginator;
  }

  showLoteMovements(): void {
    this.dialogRef.close(true);
  }
}

const loteExample: LoteItem = {
  _id: '1',
  noLote: '123',
  idStorage: '12',
  quantity: '150',
  cost: '1250',
  expiration_date: '12/10/2022',
  stock: '37',
};

const LoteMovements: CardexItem[] = [
  {
    lote: 11,
    date: '12/05/2021',
    action: 'IN',
    detail: 'Compra',
    source: 'Proveedor N',
    destiny: 'Bodega Central',
    quantity: 100,
    residue: 145,
  },
  {
    lote: 11,
    date: '12/05/2021',
    action: 'IN',
    detail: 'Traslado',
    source: 'Sucursal: Farmacia',
    destiny: 'Bodega Central',
    quantity: 50,
    residue: 195,
  },
  {
    lote: 11,
    date: '12/05/2021',
    action: 'OUT',
    detail: '',
    source: 'Sucursal: Farmacia 4',
    destiny: 'Bodega Central',
    quantity: 13,
    residue: 182,
  },
];
