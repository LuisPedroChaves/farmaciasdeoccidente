import { Component, OnInit, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { BankItem } from 'src/app/core/models/Bank';
import { CellarItem } from 'src/app/core/models/Cellar';
import { EmployeeItem } from 'src/app/core/models/Employee';
import { JobItem } from 'src/app/core/models/Jobs';
import { BankService } from 'src/app/core/services/httpServices/bank.service';
import { CellarService } from 'src/app/core/services/httpServices/cellar.service';
import { EmployeeService } from 'src/app/core/services/httpServices/employee.service';
import { JobsService } from 'src/app/core/services/httpServices/jobs.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationComponent } from 'src/app/pages/shared-components/confirmation/confirmation.component';
import { AppState } from 'src/app/store/app.reducer';
import { DepartmentListComponent } from '../department-list/department-list.component';
import { NewJobComponent } from '../new-job/new-job.component';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  searchtext: string;
  employees: EmployeeItem[] = [];
  selectedCellars: any[] = [];

  cellarsSubscription: Subscription;
  cellars: CellarItem[];

  banksubscription: Subscription;
  banks: BankItem[];

  sideopen: boolean = false;
  panel: string = 'jobs';

  jobs: JobItem[] = [];
  departments: {_id: string, name:string}[] = [];
  smallScreen: boolean;
  configsubscription: Subscription;
  selectedEmployee: EmployeeItem;

  constructor(public dialog: MatDialog, public cellarService: CellarService, public store: Store<AppState>, public jobsService: JobsService, public toasty: ToastyService, public employeeService: EmployeeService, public bankService: BankService) { }

  ngOnInit(): void {

    this.employeeService.readData().subscribe(data => {
      this.employees = data;
    });

    
    this.cellarsSubscription = this.cellarService.readData().subscribe(data => {
      this.cellars = data;
      this.cellars.forEach(c => { this.selectedCellars.push(c._id); });
      this.employeeService.getData(this.selectedCellars);
    });
    this.banksubscription = this.bankService.readData().subscribe(data => {
      this.banks = data;
    });

    this.configsubscription = this.store.select('config').pipe(filter(config => config !== null)).subscribe(config => {
        this.smallScreen = config.smallScreen;
    });

   

    this.jobsService.readData().subscribe(data => {
      this.jobs = data;
    });
    
    this.jobsService.loadDepartments().subscribe(data => {
      this.departments = data.jobDepartments;
    });
  }

  ngAfterContentInit() {
    this.cellarService.loadData();
    this.jobsService.getJobs();
    
    this.bankService.getData();
  }





  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // OPERATIONAL FUNCTIONS ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  closebar() {
    this.sideopen = false;
    this.panel = undefined;
    this.selectedEmployee = undefined;
  }


  



  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // JOBS FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  openJobs() {
    this.sideopen = true;
    this.panel = 'Puestos';
  }


  openDepartments() {
    const dialogRef = this.dialog.open(DepartmentListComponent, {
      width: this.smallScreen ? '100%' : '450px',
      data: {  departments: this.departments, smallScreen: this.smallScreen },
      panelClass: ['farmacia-dialog', 'farmacia']
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data === true) {
        this.jobsService.loadDepartments().subscribe(data => {
          this.departments = data.jobDepartments;
        });
      }
    });
  }


  getDepartment(id: string) {
    return this.departments.find(d => d._id === id).name || '';
  }


  addJob() {
    const dialog = this.dialog.open(NewJobComponent, {
      width: this.smallScreen ? '100%' : '450px',
      data: { role: 'add', departments: this.departments, smallScreen: this.smallScreen },
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
      data: { role: 'edit', job: e, departments: this.departments, smallScreen: this.smallScreen },
      panelClass: ['farmacia-dialog', 'farmacia']
    });

    dialog.afterClosed().subscribe(data => {
      if (data !== undefined) {
        this.jobsService.loadJobs();
      }
    });
  }

  deleteJob(job: JobItem) {
    const dialog = this.dialog.open(ConfirmationComponent, {
      width: this.smallScreen ? '100%' : '350px',
      data: { title: 'Eliminar Puesto', msg: '¿Confirma que desea eliminar el puesto de trabajo?' },
      panelClass: ['farmacia-dialog', 'farmacia']
    });

    dialog.afterClosed().subscribe(data => {
      if (data !== undefined) {
        if (data === true) {

          this.jobsService.deleteJob(job._id).subscribe(data => {
            this.toasty.success('Puesto eliminado exitósamente');
            this.jobsService.loadJobs();
          });
        }
      }
    });
  }








  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // EMPLOYEES FUNCTIONS /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  newEmployee() {
    this.sideopen = true;
    this.panel = 'Nuevo Empleado';
  }


  selectEmployee(e: EmployeeItem) {
    this.selectedEmployee = {...e};
    this.sideopen = true;
    this.panel = 'Editar Empleado';
  }



}
