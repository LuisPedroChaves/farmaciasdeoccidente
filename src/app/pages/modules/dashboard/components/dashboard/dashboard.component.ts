import { Component, OnInit, NgZone, AfterContentInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { NewCellarComponent } from '../../../../shared-components/new-cellar/new-cellar.component';
import { CellarItem } from 'src/app/core/models/Cellar';
import { CellarService } from '../../../../../core/services/httpServices/cellar.service';
import { Router } from '@angular/router';
import { WebsocketService } from 'src/app/core/services/httpServices/websocket.service';
const SMALL_WIDTH_BREAKPOINT = 960;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterContentInit, OnDestroy {

  public mediaMatcher: MediaQueryList = window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);

  cellarsSubscription: Subscription;
  cellars: CellarItem[];


  constructor(
    zone: NgZone,
    public dialog: MatDialog,
    public cellarService: CellarService,
    private router: Router,
    public wsService: WebsocketService
  ) {
    this.mediaMatcher.addListener(mql => zone.run(() => {
      this.mediaMatcher = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);
    }));
  }

  ngOnInit(): void {
    this.cellarsSubscription = this.cellarService.readData().subscribe(data => {
      this.cellars = data;
    });
  }

  ngAfterContentInit() {
    this.cellarService.loadData();
  }

  ngOnDestroy() {
    this.cellarsSubscription.unsubscribe();
  }

  getTypeIcon(t: string): string {
    let icon = '';
    switch (t) {
      case 'BODEGA': icon = 'store'; break;
      case 'FARMACIA': icon = 'local_pharmacy'; break;
    }
    return icon;
  }

  accessToCellar(c: CellarItem) {
    localStorage.setItem('currentstore', JSON.stringify(c));
    this.wsService.loginCellar(c).then(() => {
      this.router.navigate(['/']);
    });
  }

  newCellar() {
    const dialogRef = this.dialog.open(NewCellarComponent, {
      disableClose: true,
      width: '600px',
      panelClass: ['farmacia-dialog', 'farmacia']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.cellarService.loadData();
      }
    });
  }

}
