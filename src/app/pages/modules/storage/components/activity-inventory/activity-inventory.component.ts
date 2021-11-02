import { Component, OnInit } from '@angular/core';
import { CardexItem } from 'src/app/core/models/Kardex';

@Component({
  selector: 'app-activity-inventory',
  templateUrl: './activity-inventory.component.html',
  styleUrls: ['./activity-inventory.component.scss'],
})
export class ActivityInventoryComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
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
  },
  {
    lote: 12,
    date: '12/05/2021',
    action: 'IN',
    detail: 'Traslado',
    source: 'Sucursal: Farmacia',
    destiny: 'Bodega Central',
    quantity: 50,
  },
  {
    lote: 13,
    date: '12/05/2021',
    action: 'OUT',
    detail: '',
    source: 'Sucursal: Farmacia 4',
    destiny: 'Bodega Central',
    quantity: 50,
  },
  {
    lote: 14,
    date: '12/05/2021',
    action: 'IN',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 50,
  },
  {
    lote: 15,
    date: '12/05/2021',
    action: 'IN',
    source: 'Bodega Central',
    destiny: 'Sucursal: Farmacia 2',
    quantity: 50,
  },
  {
    lote: 16,
    date: '12/05/2021',
    action: 'IN',
    source: 'Sucursal: Farmacia 2',
    destiny: 'Sucursal: Pradera',
    quantity: 50,
  },
  {
    lote: 17,
    date: '12/05/2021',
    action: 'OUT',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 50,
  },
  {
    lote: 18,
    date: '12/05/2021',
    action: 'OUT',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 50,
  },
  {
    lote: 19,
    date: '12/05/2021',
    action: 'OUT',
    detail: 'traslado',
    source: 'Sucursal: Farmacia 1',
    destiny: 'Bodega Central',
    quantity: 50,
  },
  {
    lote: 20,
    date: '12/05/2021',
    action: 'OUT',
    detail: 'traslado',
    source: 'Sucursal: Pradera',
    destiny: 'Bodega Central',
    quantity: 50,
  },
];
