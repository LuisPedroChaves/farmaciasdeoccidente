import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewEmployeeJobComponent } from '../new-employee-job/new-employee-job.component';


@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.scss']
})
export class NewEmployeeComponent implements OnInit {

  @Input() smallScreen: boolean;

  departments: any[] = [
    'Alta Verapaz',
    'Baja Verapaz',
    'Chimaltenago',
    'Chiquimula',
    'Guatemala',
    'El Progreso',
    'Escuintla',
    'Huehuetenango',
    'Izabal',
    'Jalapa',
    'Jutiapa',
    'Petén',
    'Quetzaltenango',
    'Quiché',
    'Retalhuleu',
    'Sacatepequez',
    'San Marcos',
    'Santa Rosa',
    'Sololá',
    'Suchitepequez',
    'Totonicapán',
    'Zacapa'
  ];

  @Input() jobs: any[] = [];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }



  saveEmployee() {

  }

  addJob() {
    const dialogRef = this.dialog.open(NewEmployeeJobComponent, {
      width: this.smallScreen ? '100%' : '450px',
      panelClass: ['farmacia-dialog', 'farmacia'],
      data: { jobs: this.jobs }
    });


    dialogRef.afterClosed().subscribe(data => {

    });
  }

}
