import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { CellarItem } from 'src/app/core/models/Cellar';
import { CellarService } from '../../../../../core/services/httpServices/cellar.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.reducer';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-pharma',
  templateUrl: './dashboard-pharma.component.html',
  styleUrls: ['./dashboard-pharma.component.scss']
})
export class DashboardPharmaComponent implements OnInit, AfterContentInit {

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

  sessionSubscription: Subscription;
  isAdmin = false;

  constructor(
    public store: Store<AppState>,
    private cellarService: CellarService,
    private toasty: ToastyService,
    public dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.sessionSubscription = this.store.select('session').pipe(filter( session => session !== null )).subscribe(session => {
      if (session.currentUser) {
        if (session.currentUser.type === 'ADMIN') {
          this.isAdmin = true;
        }
      }
    });
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
