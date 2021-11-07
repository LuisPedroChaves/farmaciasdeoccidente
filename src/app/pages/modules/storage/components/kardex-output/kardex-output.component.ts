import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CardexItem } from 'src/app/core/models/Kardex';
import { LoteDetailsComponent } from '../lote-details/lote-details.component';

@Component({
  selector: 'app-kardex-output',
  templateUrl: './kardex-output.component.html',
  styleUrls: ['./kardex-output.component.scss'],
})
export class KardexOutputComponent implements OnInit, AfterViewInit {
  smallScreen = window.innerWidth < 960 ? true : false;

  displayedColumns: string[] = [
    'lote',
    'date',
    'action',
    'source',
    'destiny',
    'quantity',
  ];

  dataSource = new MatTableDataSource<CardexItem>(Outputs);
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
const Outputs: CardexItem[] = [
  {
    lote: 1,
    date: '12/05/2021',
    action: 'Traslado',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 50,
    residue: 45,
  },
  {
    lote: 2,
    date: '12/05/2021',
    action: 'Traslado',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 50,
    residue: 45,
  },
  {
    lote: 3,
    date: '12/05/2021',
    action: 'Traslado',
    source: 'Sucursal: Centro',
    destiny: 'Bodega Central',
    quantity: 50,
    residue: 45,
  },
  {
    lote: 4,
    date: '12/05/2021',
    action: 'Traslado',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 50,
    residue: 45,
  },
  {
    lote: 5,
    date: '12/05/2021',
    action: 'Traslado',
    source: 'Sucursal: Centro',
    destiny: 'Bodega Central',
    quantity: 50,
    residue: 45,
  },
  {
    lote: 6,
    date: '12/05/2021',
    action: 'Traslado',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 50,
    residue: 45,
  },
  {
    lote: 7,
    date: '12/05/2021',
    action: 'Traslado',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 50,
    residue: 45,
  },
  {
    lote: 8,
    date: '12/05/2021',
    action: 'Traslado',
    source: 'Bodega Central',
    destiny: 'Sucursal: Pradera',
    quantity: 50,
    residue: 45,
  },
  {
    lote: 9,
    date: '12/05/2021',
    action: 'Traslado',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 50,
    residue: 45,
  },
  {
    lote: 10,
    date: '12/05/2021',
    action: 'Traslado',
    source: 'Sucursal: Farmacia 1',
    destiny: 'Bodega Central',
    quantity: 50,
    residue: 45,
  },
];
