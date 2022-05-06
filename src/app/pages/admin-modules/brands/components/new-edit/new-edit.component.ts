import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BrandService } from '../../../../../core/services/httpServices/brand.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { BrandItem } from '../../../../../core/models/Brand';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-new-edit',
  templateUrl: './new-edit.component.html',
  styleUrls: ['./new-edit.component.scss']
})
export class NewEditComponent implements OnInit {

  @Input() brandForm: FormGroup;
  @Output() close = new EventEmitter();
  @Output() save = new EventEmitter<BrandItem>();
  @Output() delete = new EventEmitter<string>();

  loading = false;

  constructor(
    private brandService: BrandService,
    private toastyService: ToastyService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  newBrand() {
    this.loading = true;

    if (this.brandForm.controls._id.value) {
      this.brandService.update({ ...this.brandForm.value }).subscribe(resp => {
        this.toastyService.success('Laboratorio editado exitosamente')
        this.close.emit();
        this.save.emit(resp.brand)
        this.loading = false;
      });
    } else {
      this.brandService.create({ ...this.brandForm.value }).subscribe(resp => {
        this.toastyService.success('Laboratorio creado exitosamente')
        this.close.emit();
        this.save.emit(resp.brand)
        this.loading = false;
      });
    }
  }

  remove(brand: BrandItem) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Eliminar Laboratorio',
        message:
          '¿Confirma que desea eliminar el laboratorio:  ' +
          brand.name +
          '?',
        description: false,
      },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        // this.loading = true;
        this.brandService.delete(brand).subscribe(
          (res) => {
            this.toastyService.success('Laboratorio eliminado exitosamente');
            this.close.emit();
            this.delete.emit(brand._id);
          },
          (error) => {
            // this.loading = false;
            this.toastyService.error('Error al eliminar el Laboratorio');
          }
        );
      }
    });
  }


}
