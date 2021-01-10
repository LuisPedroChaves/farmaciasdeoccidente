import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { combineLatest } from 'rxjs/operators';

@Component({
  selector: 'app-dispatches',
  templateUrl: './dispatches.component.html',
  styleUrls: ['./dispatches.component.scss']
})
export class DispatchesComponent implements OnInit, OnDestroy, AfterContentInit {

      // subscriptions ------------------
      configSubscription: Subscription;
      sessionsubscription: Subscription;
      coursesubs: Subscription;
      searchtext: string;

        // screen
    smallScreen: boolean;

    courses: any[] =  [
      {
        _campus: 'HOLA',
        _level: 'NIVEL',
        _section: 'SECTION',
        _employee_job: 'HOLA',
        name: 'MATEMATICAS',
        details: 'detalles',
        time: 10,
        image: 'Geometry.jpg',
        isActive: true,
      },
      {
        _campus: 'HOLA',
        _level: 'NIVEL',
        _section: 'SECTION',
        _employee_job: 'HOLA',
        name: 'MATEMATICAS',
        details: 'detalles',
        time: 10,
        image: 'Geometry.jpg',
        isActive: true,
      },
      {
        _campus: 'HOLA',
        _level: 'NIVEL',
        _section: 'SECTION',
        _employee_job: 'HOLA',
        name: 'MATEMATICAS',
        details: 'detalles',
        time: 10,
        image: 'Geometry.jpg',
        isActive: true,
      },
      {
        _campus: 'HOLA',
        _level: 'NIVEL',
        _section: 'SECTION',
        _employee_job: 'HOLA',
        name: 'MATEMATICAS',
        details: 'detalles',
        time: 10,
        image: 'Geometry.jpg',
        isActive: true,
      },
      {
        _campus: 'HOLA',
        _level: 'NIVEL',
        _section: 'SECTION',
        _employee_job: 'HOLA',
        name: 'MATEMATICAS',
        details: 'detalles',
        time: 10,
        image: 'Geometry.jpg',
        isActive: true,
      },
      {
        _campus: 'HOLA',
        _level: 'NIVEL',
        _section: 'SECTION',
        _employee_job: 'HOLA',
        name: 'MATEMATICAS',
        details: 'detalles',
        time: 10,
        image: 'Geometry.jpg',
        isActive: true,
      },
      {
        _campus: 'HOLA',
        _level: 'NIVEL',
        _section: 'SECTION',
        _employee_job: 'HOLA',
        name: 'MATEMATICAS',
        details: 'detalles',
        time: 10,
        image: 'Geometry.jpg',
        isActive: true,
      },
      {
        _campus: 'HOLA',
        _level: 'NIVEL',
        _section: 'SECTION',
        _employee_job: 'HOLA',
        name: 'MATEMATICAS',
        details: 'detalles',
        time: 10,
        image: 'Geometry.jpg',
        isActive: true,
      },
      {
        _campus: 'HOLA',
        _level: 'NIVEL',
        _section: 'SECTION',
        _employee_job: 'HOLA',
        name: 'MATEMATICAS',
        details: 'detalles',
        time: 10,
        image: 'Geometry.jpg',
        isActive: true,
      },
    ];
    employeejobs: any[];
    loading = false;
    allsubscriptions;
    saving = false;

    @ViewChild(MatMenuTrigger)
    contextMenu: MatMenuTrigger;
    contextMenu2: MatMenuTrigger;

    contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
        //TODO: public store: Store<AppState>,
        private bottomSheet: MatBottomSheet,
        public toasty: ToastyService,
        public dialog: MatDialog,
        public router: Router,
  ) { }

  ngOnInit(): void {
    // this.configSubscription = this.store.select('config').pipe(filter( configd => configd !== null)).subscribe( configd => {
    //   this.smallScreen = configd.deviceConfig.smallScreen;
    // });
    // this.sessionsubscription = this.store.select('session').pipe(filter( session => session !== null)).subscribe( session => {
    //     if (session.permissions !== null) {
    //       const b = session.permissions.filter(pr => pr.name === 'courses');
    //       this.coursesp = b.length > 0 ? b[0].options : [];

    //     }
    // });


    // this.allsubscriptions = combineLatest([
    //   this.coursesService.readData()
    // ]).subscribe(data => {
    //   this.courses = data[2];
    //   this.loading = false;
    // });
  }

  ngAfterContentInit() {
    // this.levelsService.getDataSections();
  }

  ngOnDestroy(): void {
    this.configSubscription?.unsubscribe();
    this.sessionsubscription?.unsubscribe();
    this.allsubscriptions?.unsubscribe();
  }

  generateImage(): string {
    const image = 'Geometry.jpg';
    return image;
  }

}
