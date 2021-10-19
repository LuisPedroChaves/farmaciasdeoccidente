import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LoteItem } from 'src/app/core/models/Lote';

@Component({
  selector: 'app-lote-details',
  templateUrl: './lote-details.component.html',
  styleUrls: ['./lote-details.component.scss'],
})
export class LoteDetailsComponent implements OnInit {
  loteExample = loteExample;
  constructor(public dialogRef: MatDialogRef<LoteDetailsComponent>) {}

  ngOnInit(): void {}
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
