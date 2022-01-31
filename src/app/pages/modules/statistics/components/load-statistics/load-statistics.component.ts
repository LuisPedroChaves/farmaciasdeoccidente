import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BrandItem } from 'src/app/core/models/Brand';
import { BrandService } from 'src/app/core/services/httpServices/brand.service';
import { TempStorageService } from 'src/app/core/services/httpServices/temp-storage.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { CellarItem } from '../../../../../core/models/Cellar';

@Component({
  selector: 'app-load-statistics',
  templateUrl: './load-statistics.component.html',
  styleUrls: ['./load-statistics.component.scss']
})
export class LoadStatisticsComponent implements OnInit, AfterContentInit, OnDestroy {

  loading = false;
  progress: number = 0;
  brandName = '';
  currentIndex = 1;
  currentCellar: CellarItem;

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

  brandsSubscription: Subscription;
  brands: BrandItem[];

  constructor(
    private tempStorageService: TempStorageService,
    private dialog: MatDialog,
    private toastyService: ToastyService,
    private brandService: BrandService
  ) {
    this.brandsSubscription = this.brandService
      .readData()
      .subscribe((data: BrandItem[]) => {
        this.brands = data;
      });
  }

  ngOnInit(): void {
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
    console.log(this.currentCellar);
  }

  ngAfterContentInit(): void {
    this.brandService.loadData();
  }

  ngOnDestroy(): void {
    this.brandsSubscription?.unsubscribe();
  }

  getBrand(brand: BrandItem) {
    if (brand) {
      this.form.get('_brand').setValue(brand._id);
    } else {
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
        title: 'INGRESO DE ESTADÍSTICAS',
        message:
          '¿Confirma que desea actualizar las estadisticas con los valores ingresados?',
      },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result !== undefined) {
        this.loading = true;
        if (this.form.controls._brand.value) {
          this.progress = 50;
          this.brandName = 'Laboratorio seleccionado'
          this.currentIndex = this.brands.length
          this.form.get('_cellar').setValue(this.currentCellar._id);
          this.tempStorageService.updateGlobal({ ...this.form.value })
            .subscribe(async (resp) => {
              this.toastyService.success('Estadísticas actualizadas correctamente');
              this.loading = false;
              this.progress = 0;
              this.brandName = '';
            });
        }else {
          await this.loadServiceBrand(0);
          this.toastyService.success('Estadísticas actualizadas correctamente');
          this.loading = false;
          this.progress = 0;
          this.brandName = '';
        }
      }
    });
  }

  loadServiceBrand(index: number) {
    return new Promise(async (resolve, reject) => {
      const BRAND = this.brands.find((b, i) => i === index)
      if (BRAND) {
        this.progress = ((index * 100) / this.brands.length)
        this.brandName = BRAND.name;
        this.currentIndex = index;
        this.form.get('_cellar').setValue(this.currentCellar._id);
        this.form.get('_brand').setValue(this.brands[index]._id);
        this.tempStorageService.updateGlobal({ ...this.form.value })
          .subscribe(async (resp) => {
            index++;
            await this.loadServiceBrand(index);
            resolve(true);
          });
      } else {
        resolve(true);
      }
    });
  }
}
