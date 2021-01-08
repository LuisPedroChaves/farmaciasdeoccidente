import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CellarItem } from '../../../core/models/Cellar';

@Component({
  selector: 'app-new-cellar',
  templateUrl: './new-cellar.component.html',
  styleUrls: ['./new-cellar.component.scss']
})
export class NewCellarComponent implements OnInit {

  creatingCellar = false;
  newCellar: CellarItem;

  constructor(public dialogRef: MatDialogRef<NewCellarComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

  }

  public close() {
    this.dialogRef.close();
  }

  public saveCellar() {
    this.creatingCellar = true;
    setTimeout(() => {
      this.creatingCellar = false;
      this.dialogRef.close(this.newCellar);
    }, 1000);
  }

}
