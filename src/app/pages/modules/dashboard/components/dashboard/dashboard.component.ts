import { Component, OnInit, NgZone, AfterContentInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { NewCellarComponent } from '../../../../shared-components/new-cellar/new-cellar.component';
import { CellarItem } from 'src/app/core/models/Cellar';
import { CellarService } from '../../../../../core/services/httpServices/cellar.service';
import { CurrentCellarService } from '../../../../../core/services/internal/current-cellar.service';
import { Router } from '@angular/router';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
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
    private currentCellarService: CurrentCellarService,
    private router: Router,
    public toasty: ToastyService
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
      case 'BODEGA': icon = 'all_inbox'; break;
      case 'FARMACIA': icon = 'store'; break;
    }
    return icon;
  }

  accessToCellar(c: CellarItem) {
    this.currentCellarService.setData(c);
    localStorage.setItem('currentstore', JSON.stringify(c));
    if (c.type === 'FARMACIA') {
      this.router.navigate(['/store']);
    } else if (c.type === 'BODEGA') {
      this.router.navigate(['/factory']);
    }
  }

  newCellar() {
    const dialogRef = this.dialog.open(NewCellarComponent, {
      width: '600px',
      panelClass: 'iea-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("🚀 ~ file: dashboard.component.ts ~ line 78 ~ DashboardComponent ~ dialogRef.afterClosed ~ result", result)
      this.toasty.success('Sucursal agregada exitosamente Exitosamente');
      if (result !== undefined) {
        this.cellarService.createCellar(result).subscribe(data => {
          if (data.ok === true) {
            this.toasty.success('Sucursal agregada exitosamente Exitosamente');
            this.cellarService.loadData();
          } else {
            this.toasty.error('Error al agregar la sucursal', 'Aceptar');
          }
        });
      }
    });
  }

}
