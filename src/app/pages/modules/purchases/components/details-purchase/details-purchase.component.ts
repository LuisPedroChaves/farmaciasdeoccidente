import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PurchaseItem } from '../../../../../core/models/Purchase';

@Component({
  selector: 'app-details-purchase',
  templateUrl: './details-purchase.component.html',
  styleUrls: ['./details-purchase.component.scss']
})
export class DetailsPurchaseComponent implements OnInit {

  purchase: PurchaseItem;

  constructor(
    public dialogRef: MatDialogRef<DetailsPurchaseComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.purchase = this.data;
  }

}
