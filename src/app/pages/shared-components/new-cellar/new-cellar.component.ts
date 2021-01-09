import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CellarService } from '../../../core/services/httpServices/cellar.service';
import { ToastyService } from '../../../core/services/internal/toasty.service';
import { CellarItem } from '../../../core/models/Cellar';

@Component({
  selector: 'app-new-cellar',
  templateUrl: './new-cellar.component.html',
  styleUrls: ['./new-cellar.component.scss']
})
export class NewCellarComponent implements OnInit {

  creatingCellar = false;
  newCellar: CellarItem = {
    name: '',
    address: '',
    description: '',
    type: 'FARMACIA',
  };

  constructor(public dialogRef: MatDialogRef<NewCellarComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public cellarService: CellarService, private toasty: ToastyService) { }

  ngOnInit(): void {

  }

  public close() {
    this.dialogRef.close();
  }

  public saveCellar() {
    this.creatingCellar = true;
    this.cellarService.createCellar(this.newCellar).subscribe(data => {
      if (data.ok === true) {
        this.toasty.success('Sucursal creada exitosamente');
        this.dialogRef.close('ok');
        this.creatingCellar = false;
      } else {
      }
    }, err => {
    console.log("🚀 ~ file: new-cellar.component.ts ~ line 42 ~ NewCellarComponent ~ this.cellarService.createCellar ~ err", err)
      this.creatingCellar = false;
      this.toasty.error('Error al crear la sucursal');
    });
  }

}
