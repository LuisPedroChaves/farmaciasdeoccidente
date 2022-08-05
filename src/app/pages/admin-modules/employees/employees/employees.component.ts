import { Component, OnInit, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CellarItem } from 'src/app/core/models/Cellar';
import { CellarService } from 'src/app/core/services/httpServices/cellar.service';
import { JobsService } from 'src/app/core/services/httpServices/jobs.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationComponent } from 'src/app/pages/shared-components/confirmation/confirmation.component';
import { AppState } from 'src/app/store/app.reducer';
import { NewJobComponent } from '../new-job/new-job.component';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  searchtext: string;
  employees: any[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  selectedCellars: any[] = [];

  cellarsSubscription: Subscription;
  cellars: CellarItem[];

  sideopen: boolean = false;
  panel: string = 'jobs';

  jobs: any[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
  departments: [] = [];
  smallScreen: boolean;
  configsubscription: Subscription;

  constructor(public dialog: MatDialog, public cellarService: CellarService, public store: Store<AppState>, public jobsService: JobsService) { }

  ngOnInit(): void {
    this.cellarsSubscription = this.cellarService.readData().subscribe(data => {
      this.cellars = data;
      this.cellars.forEach(c => { this.selectedCellars.push(c._id); });
    });

    this.configsubscription = this.store.select('config').pipe(filter(config => config !== null)).subscribe(config => {
        this.smallScreen = config.smallScreen;
    });


    this.jobsService.readData().subscribe(data => {
      this.jobs = data;
    });
    
    this.jobsService.loadDepartments().subscribe(data => {
      this.departments = data;
    });
  }

  ngAfterContentInit() {
    this.cellarService.loadData();
    this.jobsService.getJobs();
  }


  selectEmployee(e) {

  }


  loadEmployees() {}


  openJobs() {
    this.sideopen = true;
    this.panel = 'Puestos';
  }



  addJob() {
    const dialog = this.dialog.open(NewJobComponent, {
      width: this.smallScreen ? '100%' : '450px',
      data: { role: 'add', departments: this.departments },
      panelClass: ['farmacia-dialog', 'farmacia']
    });

    dialog.afterClosed().subscribe(data => {
      if (data !== undefined) {
        this.jobsService.loadJobs();
      }
    });
  }

  editJob(e) {
    const dialog = this.dialog.open(NewJobComponent, {
      width: this.smallScreen ? '100%' : '450px',
      data: { role: 'edit', job: e, departments: this.departments },
      panelClass: ['farmacia-dialog', 'farmacia']
    });

    dialog.afterClosed().subscribe(data => {
      if (data !== undefined) {
        this.jobsService.loadJobs();
      }
    });
  }

  deleteJob(e) {
    const dialog = this.dialog.open(ConfirmationComponent, {
      width: this.smallScreen ? '100%' : '350px',
      data: { title: 'Eliminar Puesto', msg: '¿Confirma que desea eliminar el puesto de trabajo?' },
      panelClass: ['farmacia-dialog', 'farmacia']
    });

    dialog.afterClosed().subscribe(data => {
      if (data !== undefined) {
        // this.jobService.loadData();
      }
    });
  }








  newEmployee() {
    this.sideopen = true;
    this.panel = 'Empleados';
  }



}
