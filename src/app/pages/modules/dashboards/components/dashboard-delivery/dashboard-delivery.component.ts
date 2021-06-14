import { Component, OnInit, AfterContentInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { RouteItem } from 'src/app/core/models/Route';
import { UserItem } from 'src/app/core/models/User';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { AppState } from 'src/app/core/store/app.reducer';
import { RouteService } from '../../../../../core/services/httpServices/route.service';
import { OrderItem } from '../../../../../core/models/Order';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-dashboard-delivery',
  templateUrl: './dashboard-delivery.component.html',
  styleUrls: ['./dashboard-delivery.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardDeliveryComponent implements OnInit, OnDestroy {

  smallScreen = window.innerWidth < 960 ? true : false;

  sessionsubscription: Subscription;
  loading = false;
  searchText: string;

  selectedUser: UserItem;
  activeRoutes: RouteItem[];
  routes: RouteItem[];

  avatars = [
    { index: 0, image: 'assets/images/avatars/01.png' },
    { index: 1, image: 'assets/images/avatars/02.png' },
    { index: 2, image: 'assets/images/avatars/03.png' },
    { index: 3, image: 'assets/images/avatars/04.png' },
    { index: 4, image: 'assets/images/avatars/05.png' },
    { index: 5, image: 'assets/images/avatars/00M.jpg' },
    { index: 6, image: 'assets/images/avatars/00F.jpg' },
  ];

  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();
  currentFilter = 'current';

  constructor(
    public store: Store<AppState>,
    public toasty: ToastyService,
    public dialog: MatDialog,
    public router: Router,
    public routeService: RouteService
  ) {
    this.routeService.readData().subscribe(data => {
      this.routes = data;
    });
   }

  ngOnInit(): void {
    this.sessionsubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      if (session.currentUser) {
        this.selectedUser = session.currentUser.user;
      }
      // if (session.permissions !== null) {
      //   const b = session.permissions.filter(pr => pr.name === 'orders');
      //   this.ordersp = b.length > 0 ? b[0].options : [];
      // }
    });
    this.loadRoutes();
  }

  ngOnDestroy(): void {
    this.sessionsubscription?.unsubscribe();
  }

  selectOrder(order: OrderItem) {
    this.router.navigate(['/order', order._id, 'delivery']);
  }

  loadRoutes() {
    this.loading = true;
    this.routeService.getActives(this.selectedUser._id).subscribe(data => {
      this.activeRoutes = data.actives;
      this.loading = false;
    });
  }

  confirmRoute(type: string, route: RouteItem) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: `${type} Ruta`, message: `¿Confirma que desea  ${type}  la ruta  ${route.noRoute} ?`},
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia' ],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === true) {
          this.loading = true;
          switch (type) {
            case 'confirmar':
              route.state = 'RUTA'
              break;
            case 'rechazar':
              route.state = 'RECHAZADA'
              break;
            default:
              break;
          }
          this.routeService.updateRouterState(route).subscribe(data => {
            this.toasty.success(`Ruta ${type} exitosamente`);
            this.loading = false;
            this.loadRoutes();
          }, error => {
            this.loading = false;
            this.toasty.error(`Error al ${type} el ruta`);
          });
        }
      }
    });
  }
}
