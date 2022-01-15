import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { CellarItem } from 'src/app/core/models/Cellar';
import { TempStorageService } from '../../../../../core/services/httpServices/temp-storage.service';
import { CellarService } from '../../../../../core/services/httpServices/cellar.service';
import { BrandItem } from '../../../../../core/models/Brand';

@Component({
  selector: 'app-load-statistics-global',
  templateUrl: './load-statistics-global.component.html',
  styleUrls: ['./load-statistics-global.component.scss']
})
export class LoadStatisticsGlobalComponent implements OnInit, AfterContentInit, OnDestroy {

  loading = false;
  progress: number = 0;
  cellarName = '';

  form = new FormGroup({
    _cellar: new FormControl(null),
    _brand: new FormControl(null),
    startDate: new FormControl(new Date(), Validators.required),
    endDate: new FormControl(new Date(), Validators.required),
    startDate2: new FormControl(new Date(), Validators.required),
    endDate2: new FormControl(new Date(), Validators.required),
    daysRequest: new FormControl('', Validators.required),
    supplyDays: new FormControl('', Validators.required)
  });

  cellarsSubscription: Subscription;
  cellars: CellarItem[];

  constructor(
    private tempStorageService: TempStorageService,
    private dialog: MatDialog,
    private toastyService: ToastyService,
    private cellarService: CellarService
  ) {
    this.cellarsSubscription = this.cellarService
      .readData()
      .subscribe((data: CellarItem[]) => {
        this.cellars = data;
        this.cellars = this.cellars.filter(c => c.type !== 'BODEGA');
      });
  }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    this.cellarService.loadData();
  }

  ngOnDestroy(): void {
    this.cellarsSubscription?.unsubscribe();
  }

  getBrand(brand: BrandItem) {
    if (brand) {
      this.form.get('_brand').setValue(brand._id);
    }else {
      this.form.get('_brand').setValue(null);
    }
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

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result !== undefined) {
        this.loading = true;
        await this.loadService(0);
        this.toastyService.success('Estadísticas globales actualizadas correctamente');
        this.loading = false;
        this.progress = 0;
        this.cellarName = '';
      }
    });
  }

  loadService(index: number) {
    return new Promise((resolve, reject) => {
      const CELLAR = this.cellars.find((c, i) => i === index)
      if (CELLAR) {
        this.progress = ((index * 100) / this.cellars.length)
        this.cellarName = CELLAR.name;
        this.form.get('_cellar').setValue(this.cellars[index]._id);
        this.tempStorageService.updateGlobal({ ...this.form.value })
          .subscribe(async (resp) => {
            index++;
            await this.loadService(index);
            resolve(true);
          });
      } else {
        resolve(true);
      }
    });
  }

}
