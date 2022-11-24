import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { JobsService } from 'src/app/core/services/httpServices/jobs.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { ConfirmationComponent } from 'src/app/pages/shared-components/confirmation/confirmation.component';
import { NewDepartmentComponent } from '../new-department/new-department.component';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {
  departments: {_id: string, name: string}[] = [];
  smallScreen: boolean;
  constructor(public dialogRef: MatDialogRef<DepartmentListComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public jobService: JobsService, public toasty: ToastyService) { }

  ngOnInit(): void {
    this.departments = this.data.departments;
    this.smallScreen = this.data.smallScreen;
  }



  addDepartment() {
    const dialogRef = this.dialog.open(NewDepartmentComponent, {
      width: this.smallScreen ? '100%' : '350px',
      disableClose: true,
      data: { role: 'new' },
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data !== undefined) {
        this.departments.push(data.jobDepartment);
      }
    });
  }


  update(dep:  {_id: string, name: string}) {
    const dialogRef = this.dialog.open(NewDepartmentComponent, {
      width: this.smallScreen ? '100%' : '350px',
      disableClose: true,
      data: { role: 'edit', department: dep },
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data !== undefined) {
        const index = this.departments.findIndex(d => d._id === dep._id);
        if (index > -1) {
          this.departments[index] = data.jobDepartment;
        }
      }
    });
  }

  delete(dep:  {_id: string, name: string}) {
    const dialog = this.dialog.open(ConfirmationComponent, {
      width: this.smallScreen ? '100%' : '350px',
      data: { title: 'Eliminar Departamento', msg: '¿Confirma que desea eliminar el Departamento?' },
      panelClass: ['farmacia-dialog', 'farmacia']
    });

    dialog.afterClosed().subscribe(data => {
      if (data !== undefined) {
        if (data === true) {

          this.jobService.deleteDepartment(dep).subscribe(data => {
            this.toasty.success('Departamento eliminado exitósamente');
            const index = this.departments.findIndex(d => d._id === dep._id);
            if (index > -1) {
              this.departments.splice(index, 1);
            };
          });
        }
      }
    });
  }

}
