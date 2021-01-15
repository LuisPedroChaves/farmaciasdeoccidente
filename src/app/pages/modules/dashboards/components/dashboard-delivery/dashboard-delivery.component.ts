import { Component, OnInit, AfterContentInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CellarItem } from 'src/app/core/models/Cellar';
import { CellarService } from 'src/app/core/services/httpServices/cellar.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-dashboard-delivery',
  templateUrl: './dashboard-delivery.component.html',
  styleUrls: ['./dashboard-delivery.component.scss']
})
export class DashboardDeliveryComponent implements OnInit, AfterContentInit {

  currentCellar: CellarItem = JSON.parse(localStorage.getItem('currentstore'));
  currentCellarPlaceholder: CellarItem = {
    _id: '',
    name: '',
    address: '',
    description: '',
    type: ''
  };
  editMode = false;

  counts: any;
  clientCount: number = 25;
  productCount: number = 50;
  employeesCount: number = 100;

  constructor(
    private cellarService: CellarService,
    private toasty: ToastyService,
    public dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
        // this.dashboardService.readData().subscribe(data => {
    //   this.counts = data;
    //   if (this.counts !== undefined) {
    //     this.clientCount = this.counts.clientes;
    //     this.productCount = this.counts.productos;
    //     this.employeesCount = this.counts.empleados;
    //   }
    // });
  }

  ngAfterContentInit() {
    // this.dashboardService.getData();
  }

  editModeOn() {
    this.clone(this.currentCellar, this.currentCellarPlaceholder);
    this.editMode = true;
  }
  editModeOff() {
    this.editMode = false;
  }

  clone(from: any, to: any) {
    to._id = from._id;
    to.name = from.name;
    to.address = from.address;
    to.type = from.type;
    to.description = from.description;
  }

  accessToCellar(c: CellarItem) {
    const currentC = JSON.parse(localStorage.getItem('currentstore'));
    localStorage.setItem('currentstore', JSON.stringify(c));
    if (currentC.type !== c.type) {
      if (c.type === 'FARMACIA') {
        this.router.navigate(['/']);
      } else if (c.type === 'BODEGA') {
        this.router.navigate(['/factory']);
      }
    } else {
      this.clone(this.currentCellarPlaceholder, this.currentCellar);
    }
  }

  saveCellar() {
    const newC: any = {};
    this.clone(this.currentCellarPlaceholder, newC);
    this.cellarService.updateCellar(newC).subscribe(data => {
      if (data.ok === true) {
        this.toasty.success('Modificado Exitosamente');
        this.accessToCellar(newC);
        this.editMode = false;
      }
    });
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: { title: 'Eliminar sucursal', message: '¿Confirma que desea eliminar la sucursal?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === true) {
          this.cellarService.deleteCellar(this.currentCellarPlaceholder).subscribe(data => {
            if (data.ok === true) {
              this.toasty.success('Eliminado Exitosamente');
              this.router.navigate(['/']);
            } else {
              this.toasty.success('Error eliminando la sucursal');
            }
          });
        }
      }
    });
  }

}
