import { Component, OnInit, ViewChildren } from '@angular/core';
import { NewEmployeeComponent } from '../new-employee/new-employee.component';
import { MatDialog } from '@angular/material/dialog';
import { NewJobComponent } from '../new-job/new-job.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  dialogRef: any;
  employees: any[] = [];

  editingEmployee: any = {
    _id: '',

    name: '',
    gender: '',

    dpi: '',
    birthDate: '',

    address: '',
    phone: '',

    _job: null,
    salary: 0,
    _cellar: null
  };

  jobs: any[] = [];

  columnsToDisplay = [ 'avatar', 'name', '_job', 'salary', 'dpi', 'birthDate'];
  columnsToDisplay2 = [
    { name: 'name', label: 'Nombre' },
    { name: '_job', label: 'Puesto' },
    { name: 'salary', label: 'Salario' },
    { name: 'dpi', label: 'DPI' },
    { name: 'birthDate', label: 'Edad' }
  ];
  expandedElement: any | null;

  private configSucces: any = {
    panelClass: ['style-succes'],
    duration: 2000,
    verticalPosition: 'top',
  };

  private configError: any = {
    panelClass: ['style-error'],
    duration: 2000,
    verticalPosition: 'top',
  };

  cellars: any[];

  employeeGroup: any[];
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  newEmployee(): void {
    this.dialogRef = this.dialog.open(NewEmployeeComponent, {
      width: '600px',
      // disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia']
      // data: { title: 'Nuevo Empleado', jobs: this.jobs, cellars: this.cellars }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result !== false) {
          if (result._cellar !== null) {

          }
        }
      }
    });
  }
  newJob(): void {
    this.dialogRef = this.dialog.open( NewJobComponent, {
      width: '600px',
      // disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia']
      // data: { title: 'Nuevo Empleado', jobs: this.jobs, cellars: this.cellars }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result !== false) {
          if (result._cellar !== null) {

          }
        }
      }
    });
  }


}
