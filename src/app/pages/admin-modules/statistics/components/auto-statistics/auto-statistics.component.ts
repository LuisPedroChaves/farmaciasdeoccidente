import { Component, OnInit, AfterContentInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { LoadStatisticsGlobalComponent } from './components/load-statistics-global/load-statistics-global.component';
import { AutoStatisticItem } from '../../../../../core/models/AutoStatistic';
import { AutoStatisticService } from '../../../../../core/services/httpServices/auto-statistic.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-auto-statistics',
  templateUrl: './auto-statistics.component.html',
  styleUrls: ['./auto-statistics.component.scss']
})
export class AutoStatisticsComponent implements OnInit, AfterContentInit, OnDestroy {

  @ViewChild('drawer') drawer: MatDrawer;

  title: string = '';

  autoStatisticsSubscription: Subscription;
  autoStatistics: AutoStatisticItem[];
  autoStatistic: AutoStatisticItem;

  constructor(
    private dialog: MatDialog,
    private autoStatisticService: AutoStatisticService,
    private toastyService: ToastyService
  ) { }

  ngOnInit(): void {
    this.autoStatisticsSubscription = this.autoStatisticService.readData().subscribe((data) => {
      this.autoStatistics = data;
    });
  }

  ngAfterContentInit(): void {
    this.autoStatisticService.loadData();
  }

  ngOnDestroy(): void {
    this.autoStatisticsSubscription?.unsubscribe();
  }

  loadStatistics(): void {
    const dialogRef = this.dialog.open(LoadStatisticsGlobalComponent, {
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  updateActivated(autoStatistic: AutoStatisticItem) {
    this.autoStatisticService.update(autoStatistic)
      .subscribe(resp => {
        this.toastyService.success('Configuración automática editada exitosamente')
      });
  }

  selectAutoStatistic(autoStatistic: AutoStatisticItem) {
    this.autoStatistic = autoStatistic;
    this.drawer.opened = true;
    this.title = 'Editar Configuración Automática';
  }

}
