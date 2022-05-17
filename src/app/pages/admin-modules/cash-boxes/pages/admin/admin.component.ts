import { Component, OnDestroy, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CashService } from 'src/app/core/services/httpServices/cash.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { AppState } from 'src/app/core/store/app.reducer';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { CashItem } from '../../../../../core/models/Cash';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy, AfterContentInit {

  /* #region  Header */
  @ViewChild('drawer') drawer: MatDrawer;

  drawerComponent = 'INDEPENDIENTE';
  title: string;
  cash: CashItem;
  typeNew: string;
  /* #endregion */

  editCash!: CashItem;
  titleCash!: string;

  loading = false;
  cashSubscription: Subscription;
  cashes: CashItem[];
  cashesPage: CashItem[];
  indexHovered = -1;

  sessionSubscription: Subscription;
  permissions: string[] = [];

  constructor(
    private cashService: CashService,
    public store: Store<AppState>,
    private toastyService: ToastyService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.cashSubscription = this.cashService.readData()
      .subscribe((data) => {
        this.cashes = data
        this.cashesPage = data
        this.loading = false
      });

    this.sessionSubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      if (session.permissions !== null) {
        const MODULOS = session.permissions.filter(pr => pr.name === 'cashAdmin');
        this.permissions = MODULOS.length > 0 ? MODULOS[0].options : [];
      }
    });
  }

  ngAfterContentInit(): void {
    this.cashService.loadData();
  }

  ngOnDestroy(): void {
    this.cashSubscription?.unsubscribe();
    this.sessionSubscription?.unsubscribe();
  }

  selectCash(cash: CashItem) {
    this.title = `${cash.type} | ${cash._user.name}`
    this.cash = cash;
    this.drawer.opened = true;
  }

  reset() {
    this.drawerComponent = 'INDEPENDIENTE';
    this.drawer.opened = false;
    this.cash = null;
  }

  reload() {
    this.drawer.opened = false;
    this.cashService.loadData();
  }

  delete(cash: CashItem) {
    /* #region  Validaciones */
    if (!this.permissions.includes('delete')) {
      this.toastyService.error('Acceso Denegado', 'Actualmente no cuenta con permisos para realizar para realizar esta acción');
      return
    }
    /* #endregion */

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Eliminar Caja', message: '¿Confirma que desea eliminar la caja de  ' + cash._user.name + '?', description: true },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.loading = true;

        this.cashService.delete(cash, result)
          .subscribe(resp => {
            this.toastyService.success('Caja eliminada exitosamente');
            this.cashService.loadData();
            this.loading = false;
          })
      }
    });
  }

}
