import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { TempStorageService } from '../../../../../core/services/httpServices/temp-storage.service';

@Component({
  selector: 'app-load-statistics-global',
  templateUrl: './load-statistics-global.component.html',
  styleUrls: ['./load-statistics-global.component.scss']
})
export class LoadStatisticsGlobalComponent implements OnInit {

  loading = false;

  form = new FormGroup({
    startDate: new FormControl(new Date(), Validators.required),
    endDate: new FormControl(new Date(), Validators.required),
    startDate2: new FormControl(new Date(), Validators.required),
    endDate2: new FormControl(new Date(), Validators.required),
    daysRequest: new FormControl('', Validators.required),
    supplyDays: new FormControl('', Validators.required)
  });

  constructor(
    private tempStorageService: TempStorageService,
    private dialog: MatDialog,
    private toastyService: ToastyService,
  ) { }

  ngOnInit(): void {
  }

  loadStatistics(): void {
    if (this.form.invalid) {
      this.toastyService.error('Todos los campos son obligatorios');
      return;
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'INGRESO DE ESTADÍSTICAS GLOBAL',
        message:
          '¿Confirma que desea actualizar las estadisticas en todas las farmacias?',
      },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.loading = true;
        this.tempStorageService.updateGlobal({ ...this.form.value }).subscribe(resp => {
          this.toastyService.success('Estadísticas globales actualizadas correctamente');
          this.loading = false;
        });
      }
    });
  }

}
