import { Component, OnInit, AfterContentInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { AppState } from 'src/app/core/store/app.reducer';
import { UserItem } from '../../../../../core/models/User';
import { UserService } from '../../../../../core/services/httpServices/user.service';
import { NewRouteComponent } from '../../../deliveries/components/new-route/new-route.component';
import { RouteService } from '../../../../../core/services/httpServices/route.service';
import { RouteItem } from '../../../../../core/models/Route';
import { EditRouteComponent } from '../../../deliveries/components/edit-route/edit-route.component';
import { CellarItem } from 'src/app/core/models/Cellar';
import { InternalOrderService } from '../../../../../core/services/httpServices/internal-order.service';
import { InternalOrderItem } from '../../../../../core/models/InternalOrder';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-delivery-details',
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.scss']
})
export class DeliveryDetailsComponent implements OnInit {

  sessionsubscription: Subscription;
  smallScreen = window.innerWidth < 960 ? true : false;


  selectedUser: UserItem;
  activeRoutes: RouteItem[];
  internalOrders: InternalOrderItem[];
  routes: RouteItem[];
  currentCellar: CellarItem;

  avatars = [
    { index: 0, image: '/assets/images/avatars/01.png' },
    { index: 1, image: '/assets/images/avatars/02.png' },
    { index: 2, image: '/assets/images/avatars/03.png' },
    { index: 3, image: '/assets/images/avatars/04.png' },
    { index: 4, image: '/assets/images/avatars/05.png' },
    { index: 5, image: '/assets/images/avatars/00M.jpg' },
    { index: 6, image: '/assets/images/avatars/00F.jpg' },
  ];

  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();
  currentFilter = 'current';

  deliveriesp: string[] = [];

  constructor(
    public store: Store<AppState>,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public toasty: ToastyService,
    public dialog: MatDialog,
    public userService: UserService,
    public routeService: RouteService,
    public internalOrderService: InternalOrderService
  ) {
    this.routeService.readData().subscribe(data => {
      this.routes = data;
    });
  }

  ngOnInit(): void {
    this.sessionsubscription = this.store.select('session').pipe(filter( session => session !== null)).subscribe( session => {
      if (session.permissions !== null) {
        const b = session.permissions.filter(pr => pr.name === 'deliveries');
        this.deliveriesp = b.length > 0 ? b[0].options : [];
      }
  });
    this.activatedRoute.params.subscribe((params) => {
      this.userService.getUser(params.id).subscribe(data => {
        this.selectedUser = data.user;
        this.loadRoutes();
      });
    });
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
  }

  loadRoutes() {
    this.routeService.getActives(this.selectedUser._id).subscribe(data => {
      this.activeRoutes = data.actives;
    });
    this.internalOrderService.getDelivery(this.selectedUser._id).subscribe(data => {
      this.internalOrders = data.internalOrders;
    });
    const filter = { month: this.month, year: this.year, _user: this.selectedUser._id, _cellar: this.currentCellar._id };
    this.routeService.loadData(filter);
  }

  editRoute(route: RouteItem) {
    if (route._cellar._id !== this.currentCellar._id) {
      this.toasty.error('Esta ruta no pertenece a esta sucursal');
      return;
    }
    const dialogRef = this.dialog.open(EditRouteComponent, {
      width: this.smallScreen ? '100%' : '960px',
      data: { route: route, deliveriesp: this.deliveriesp },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.loadRoutes();
      }
    });
  }

  newRoute() {
    const dialogRef = this.dialog.open(NewRouteComponent, {
      width: this.smallScreen ? '100%' : '960px',
      minHeight: '78vh',
      maxHeight: '78vh',
      data: { selectedUser: this.selectedUser, currentCellar: this.currentCellar },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.loadRoutes();
      }
    });
  }

  applyFilter(filterValue?: string) {
    if (filterValue) {

      // this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.currentFilter === 'last') {
        if (new Date().getMonth() === 0) {
          this.month = 12;
        } else {
          this.month = new Date().getMonth();

        }
      }
      if (this.currentFilter === 'current') { this.month = new Date().getMonth() + 1; }
      const filters = { month: this.month, year: this.year, _user: this.selectedUser._id, _cellar: this.currentCellar._id };
      this.routeService.loadData(filters);
    } else {
      if (this.currentFilter === 'last') {
        if (new Date().getMonth() === 0) {
          this.month = 12;
        } else {
          this.month = new Date().getMonth();

        }
      }
      if (this.currentFilter === 'current') { this.month = new Date().getMonth() + 1; }
      const filters = { month: this.month, year: this.year, _user: this.selectedUser._id, _cellar: this.currentCellar._id };
      this.routeService.loadData(filters);
    }
  }

}
