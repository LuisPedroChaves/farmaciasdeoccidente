import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { InternalOrderItem } from 'src/app/core/models/InternalOrder';
import { RouteItem } from 'src/app/core/models/Route';
import { UserItem } from 'src/app/core/models/User';
import { InternalOrderService } from 'src/app/core/services/httpServices/internal-order.service';
import { RouteService } from 'src/app/core/services/httpServices/route.service';
import { UserService } from 'src/app/core/services/httpServices/user.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { AppState } from 'src/app/core/store/app.reducer';
import { EditRouteComponent } from '../edit-route/edit-route.component';
import { NewRouteComponent } from '../new-route/new-route.component';

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

  avatars = [
    { index: 0, image: 'assets/images/avatars/01.png' },
    { index: 1, image: 'assets/images/avatars/02.png' },
    { index: 2, image: 'assets/images/avatars/03.png' },
    { index: 3, image: 'assets/images/avatars/04.png' },
    { index: 4, image: 'assets/images/avatars/05.png' },
    { index: 5, image: 'assets/images/avatars/00M.jpg' },
    { index: 6, image: 'assets/images/avatars/00F.jpg' },
  ];

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  deliveriesp: string[] = ['read', 'create', 'update', 'delete'];

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
        // this.deliveriesp = b.length > 0 ? b[0].options : [];
        // this.deliveriesp = ['read'];
      }
  });
    this.activatedRoute.params.subscribe((params) => {
      this.userService.getUser(params.id).subscribe(data => {
        this.selectedUser = data.user;
        this.loadRoutes();
      });
    });

    this.range.valueChanges
    .pipe(
      debounceTime(500),
      )
    .subscribe(range => {
      if (range.start && range.end) {
        this.loadData(range.start, range.end);
      }
    });
  }

  loadRoutes() {
    this.routeService.getActives(this.selectedUser._id).subscribe(data => {
      this.activeRoutes = data.actives;
    });
    this.internalOrderService.getDelivery(this.selectedUser._id).subscribe(data => {
      this.internalOrders = data.internalOrders;
    });
  }

  loadData(start, end) {
    this.routes = undefined;
    const startDate = start._d ? start._d : start;
    const endDate = end._d ? end._d : end;
    const FILTER = { startDate, endDate, _user: this.selectedUser._id, _cellar: null };
    this.routeService.loadData(FILTER);
  }

  editRoute(route: RouteItem) {
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
      data: { selectedUser: this.selectedUser },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.loadRoutes();
      }
    });
  }

}
