import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime } from 'rxjs/operators';
import { CardexItem } from 'src/app/core/models/Kardex';
import { LoteDetailsComponent } from '../lote-details/lote-details.component';

@Component({
  selector: 'app-activity-inventory',
  templateUrl: './activity-inventory.component.html',
  styleUrls: ['./activity-inventory.component.scss'],
})
export class ActivityInventoryComponent implements OnInit, AfterViewInit {
  smallScreen = window.innerWidth < 960 ? true : false;

  cellarType = '';

  range = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });

  rangeSelected = false;

  displayedColumnsActivity: string[] = [
    'lote',
    'date',
    'source',
    'destiny',
    'income',
    'outcome',
    'residue',
  ];
  dataMovements = new MatTableDataSource<CardexItem>(movements);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.cellarType = JSON.parse(localStorage.getItem('currentstore'));
    console.log(this.cellarType);

    this.range.valueChanges.pipe(debounceTime(500)).subscribe((range) => {
      if (range.start && range.end) {
        this.rangeSelected = true;
      }
    });
    // TODO: Servicio para Get Todos los movimientos del Cardex
  }
  ngAfterViewInit(): void {
    this.dataMovements.paginator = this.paginator;
  }
  showLote(item: any): void {
    const dialogRef = this.dialog.open(LoteDetailsComponent, {
      width: this.smallScreen ? '100%' : '30%',
      data: {
        idLote: item.id,
        currentStore: item.store,
        cellarType: this.cellarType,
        showLoteMovements: false,
      },
      minHeight: '78vh',
      maxHeight: '78vh',
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.showLoteActivity(item);
        // this.loadProducts();
      }
    });
  }

  showLoteActivity(item: any): void {
    const dialogRef = this.dialog.open(LoteDetailsComponent, {
      width: this.smallScreen ? '100%' : '70%',
      data: {
        idLote: item.id,
        currentStore: item.store,
        cellarType: this.cellarType,
        showLoteMovements: true,
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

const movements: CardexItem[] = [
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
  {
    lote: 54,
    date: '12/05/2021',
    action: 'IN',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 20,
    residue: 65,
  },
  {
    lote: 54,
    date: '12/05/2021',
    action: 'IN',
    source: 'Bodega Central',
    destiny: 'Sucursal: Farmacia 2',
    quantity: 50,
    residue: 115,
  },
  {
    lote: 75,
    date: '12/05/2021',
    action: 'IN',
    source: 'Sucursal: Farmacia 2',
    destiny: 'Sucursal: Pradera',
    quantity: 30,
    residue: 75,
  },
  {
    lote: 75,
    date: '12/05/2021',
    action: 'OUT',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 20,
    residue: 55,
  },
  {
    lote: 75,
    date: '12/05/2021',
    action: 'OUT',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 13,
    residue: 42,
  },
  {
    lote: 19,
    date: '12/05/2021',
    action: 'OUT',
    detail: 'traslado',
    source: 'Sucursal: Farmacia 1',
    destiny: 'Bodega Central',
    quantity: 17,
    residue: 33,
  },
  {
    lote: 19,
    date: '12/05/2021',
    action: 'OUT',
    detail: 'traslado',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 7,
    residue: 26,
  },
];
