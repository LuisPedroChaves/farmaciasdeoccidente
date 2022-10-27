import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FileInput } from 'ngx-material-file-input';
import { BankItem } from 'src/app/core/models/Bank';
import { CellarItem } from 'src/app/core/models/Cellar';
import { EmployeeItem, FamilyItem } from 'src/app/core/models/Employee';
import { EmployeeJobItem } from 'src/app/core/models/EmployeeJob';
import { EmployeeService } from 'src/app/core/services/httpServices/employee.service';
import { UploadFileService } from 'src/app/core/services/httpServices/upload-file.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { FilePipe } from 'src/app/core/shared/pipes/filePipes/file.pipe';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationComponent } from 'src/app/pages/shared-components/confirmation/confirmation.component';
import { NewEmployeeJobComponent } from '../new-employee-job/new-employee-job.component';

import { UploadAvatarComponent } from '../upload-avatar/upload-avatar.component';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit {

  @Input() smallScreen: boolean;
  @Input() jobs: any[] = [];
  @Input() banks: BankItem[] = [];
  @Input() cellars: CellarItem[] = [];
  @Input() employee:EmployeeItem;
  @Output() closebar = new EventEmitter<any>();

  departments: any[];
  muns: string[] = [];


  // STEP 1
  imagePreview: string;

  form1 = new FormGroup({
    photo: new FormControl(null),
    name: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    birth: new FormControl(null, Validators.required),
    gender: new FormControl(null, Validators.required),
    docType: new FormControl(null, Validators.required),
    document: new FormControl(null, Validators.required),
    code: new FormControl(null, Validators.required),
    nit: new FormControl(null, Validators.required),
    maritalStatus: new FormControl(null, Validators.required),
    email: new FormControl(null),
    address: new FormControl(null, Validators.required),
    department: new FormControl(null, Validators.required),
    city: new FormControl(null, Validators.required),
    nationality: new FormControl(null, Validators.required),
    village: new FormControl(null),
    linguisticCommunity: new FormControl(null),
  });

  // STEP 2

  form2 = new FormGroup({
    profession: new FormControl(null, Validators.required),
    academicLavel: new FormControl(null, Validators.required),
    _bank: new FormControl(null, Validators.required),
    bankAccount: new FormControl(null, Validators.required),
    igss: new FormControl(false, Validators.required),
    benefits: new FormControl(false, Validators.required),
    _cellar: new FormControl(null, Validators.required),
    details: new FormControl(null, Validators.required),
    vacationDate: new FormControl(null),
    lastVacationDate: new FormControl(null),
    disability: new FormControl(null),
    foreignPermit: new FormControl(null),
    igssNumber: new FormControl(null),
  });



  // STEP 3 
  form3 = new FormGroup({
    name: new FormControl(null, Validators.required),
    birth: new FormControl(null, Validators.required),
    type: new FormControl(null, Validators.required),
  });


  family: FamilyItem[] = [];
  employeeJobs: EmployeeJobItem[] = [];

  constructor(public dialog: MatDialog, public employeeService: EmployeeService, public filePipe: FilePipe, public toasty: ToastyService, public uploadFileService: UploadFileService) { }

  ngOnInit(): void {
    this.employeeService.getCountry().subscribe(data => {this.departments = data; });
    this.imagePreview = this.filePipe.transform(this.employee.photo, 'employees');
    this.form1 = new FormGroup({
      photo: new FormControl(this.employee.photo),
      name: new FormControl(this.employee.name, Validators.required),
      lastName: new FormControl(this.employee.lastName, Validators.required),
      birth: new FormControl(this.employee.birth, Validators.required),
      gender: new FormControl(this.employee.gender, Validators.required),
      docType: new FormControl(this.employee.docType, Validators.required),
      document: new FormControl(this.employee.document, Validators.required),
      code: new FormControl(this.employee.code, Validators.required),
      nit: new FormControl(this.employee.nit, Validators.required),
      maritalStatus: new FormControl(this.employee.maritalStatus, Validators.required),
      email: new FormControl(this.employee.email),
      address: new FormControl(this.employee.address, Validators.required),
      department: new FormControl(this.employee.department, Validators.required),
      city: new FormControl(this.employee.city, Validators.required),
      nationality: new FormControl(this.employee.nationality || null, Validators.required),
      village: new FormControl(this.employee.village || null),
      linguisticCommunity: new FormControl(this.employee.linguisticCommunity || null),
    });
    setTimeout(() => {
      this.getMun();
    }, 100);
  
    // STEP 2
  
    this.form2 = new FormGroup({
      profession: new FormControl(this.employee.profession, Validators.required),
      academicLavel: new FormControl(this.employee.academicLavel, Validators.required),
      _bank: new FormControl(this.employee._bank, Validators.required),
      bankAccount: new FormControl(this.employee.bankAccount, Validators.required),
      igss: new FormControl(this.employee.igss, Validators.required),
      benefits: new FormControl(this.employee.benefits, Validators.required),
      _cellar: new FormControl(this.employee._cellar, Validators.required),
      details: new FormControl(this.employee.details, Validators.required),
      vacationDate: new FormControl(this.employee.vacationDate),
      lastVacationDate: new FormControl(this.employee.lastVacationDate),
      igssNumber: new FormControl(this.employee.igssNumber),
      disability: new FormControl(this.employee.disability),
      foreignPermit: new FormControl(this.employee.foreignPermit),
    });


    this.family = this.employee.family;

    this.loadEmployeeJobs();

    
  }






  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // OPERATION FUNCTIONS /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getMun() {
    this.muns = this.departments.find(d => d.name === this.form1.controls.department.value).mun;
  }





  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // EMPLOYEE FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  addFamiliar() {
    if (this.form3.invalid) { return; }
    const familiar: FamilyItem = { ...this.form3.value };
    this.family.push(familiar);
    this.form3.reset();
  }

  remove(i: number) {
    this.family.splice(i, 1);
  }


  uploadAvatar() {
    const dialog = this.dialog.open(UploadAvatarComponent, {
      width: this.smallScreen ? '100%' : '450px',
      panelClass: ['farmacia-dialog', 'farmacia']
    });

    dialog.afterClosed().subscribe(data => {
      if (data !== undefined) {
        this.imagePreview = data.preview;
        const FILE: FileInput = new FileInput([data.file], ', ');
        this.form1.controls.photo.setValue(FILE);
      }
    });
  }


  saveEmployee() {
    if (this.form1.invalid || this.form2.invalid) { return; }



    
    const FILE: FileInput = this.form1.controls.photo.value;
    if (FILE) {
      this.form1.controls.photo.setValue('archivo.temp');
    } else {
      this.form1.controls.photo.setValue(null);
    }
    const employee: EmployeeItem = { ...this.form1.value, ...this.form2.value, family: this.family, _id: this.employee._id };
    this.employeeService.update(employee).subscribe(data => {
      if (FILE) {
        if (FILE.files) {
          this.uploadFileService.uploadFile(FILE.files[0], 'employees', data.employee._id).then((resp: any) => {
            this.toasty.success('Empleado modificado exitósamente');
            this.employeeService.loadData();
            this.closebar.emit(true);
            }).catch(err => {
              this.toasty.error('Falló subida de imagen');
            });
        } else {
          this.toasty.success('Empleado modificado exitósamente');
          this.employeeService.loadData();
          this.closebar.emit(true);
        }
      } else {
        this.toasty.success('Empleado modificado exitósamente');
        this.employeeService.loadData();
        this.closebar.emit(true);
      }
     

    });
  }

  deleteEmployee() {
    const dialog = this.dialog.open(ConfirmationComponent, {
      width: this.smallScreen ? '100%' : '450px',
      data: { title: 'Eliminar Empleado', msg: '¿Confirma que desea eliminar este empleado?' },
      panelClass: ['farmacia-dialog', 'farmacia']
    });

    dialog.afterClosed().subscribe(data => {
      if (data === true) {
        this.employeeService.delete(this.employee).subscribe(data => {
          this.toasty.success('Empleado eliminado exitósamente');
          this.employeeService.loadData();
          this.closebar.emit(true);
        });
      }
    });
  }








  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // JOBS FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  addJob() {
    const dialog = this.dialog.open(NewEmployeeJobComponent, {
      width: this.smallScreen ? '100%' : '450px',
      data: { employee: this.employee, jobs: this.jobs, role: 'new' },
      panelClass: ['farmacia-dialog', 'farmacia']
    });

    dialog.afterClosed().subscribe(data => {
      if (data === true) {
        this.loadEmployeeJobs();
      }
    });
  }


  loadEmployeeJobs() {
    this.employeeService.getEmployeeJobs(this.employee._id).subscribe(data => {
      this.employeeJobs = data.employeeJobs;
    });
  }



  editJob(job: EmployeeJobItem) {
    const dialog = this.dialog.open(NewEmployeeJobComponent, {
      width: this.smallScreen ? '100%' : '450px',
      data: { employee: this.employee, jobs: this.jobs, role: 'edit', employeejob: job },
      panelClass: ['farmacia-dialog', 'farmacia']
    });

    dialog.afterClosed().subscribe(data => {
      if (data === true) {
        this.loadEmployeeJobs();
      }
    });
  }

  deleteJob(job: EmployeeJobItem) {
    const dialog = this.dialog.open(ConfirmationComponent, {
      width: this.smallScreen ? '100%' : '450px',
      data: { title: 'Eliminar Puesto de trabajo', msg: '¿Confirma que desea eliminar el puesto de este empleado?' },
      panelClass: ['farmacia-dialog', 'farmacia']
    });

    dialog.afterClosed().subscribe(data => {
      if (data === true) {
        this.employeeService.deleteEmployeeJobs(job).subscribe(data => {
          this.loadEmployeeJobs();
          this.toasty.success('Puesto eliminado exitósamente');
        });
      }
    });
  }

}
