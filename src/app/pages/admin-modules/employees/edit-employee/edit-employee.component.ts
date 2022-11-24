import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FileInput } from 'ngx-material-file-input';
import { BankItem } from 'src/app/core/models/Bank';
import { CellarItem } from 'src/app/core/models/Cellar';
import { EmployeeItem, FamilyItem, VacationItem } from 'src/app/core/models/Employee';
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
  loading: boolean = false;
  cv: any;
  vacations: VacationItem[] = [];
  changed: boolean = false;
  emergencyContact:  {name: string, phone: string, _id?: string } = { name: null, phone: null };

  form1 = new FormGroup({
    photo: new FormControl(null),
    cv: new FormControl(null),
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
    _cellarIGSS: new FormControl(null, Validators.required),
    details: new FormControl(null, Validators.required),
    disability: new FormControl(null),
    foreignPermit: new FormControl(null),
    igssNumber: new FormControl(null),
    contractLaw: new FormControl(null),
    internalContract: new FormControl(null),
    confidentialityContract: new FormControl(null),
    newContract: new FormControl(null),
  });



  // STEP 3 
  form3 = new FormGroup({
    name: new FormControl(null, Validators.required),
    birth: new FormControl(null, Validators.required),
    type: new FormControl(null, Validators.required),
    phone: new FormControl(null, Validators.required),
  });


  formVacations = new FormGroup({
    start: new FormControl(null, Validators.required),
    end: new FormControl(null, Validators.required),
    constancy: new FormControl(null),
    details: new FormControl(null),
  });


  family: FamilyItem[] = [];
  employeeJobs: EmployeeJobItem[] = [];

  constructor(public dialog: MatDialog, public employeeService: EmployeeService, public http: HttpClient, public filePipe: FilePipe, public toasty: ToastyService, public uploadFileService: UploadFileService) { }

  ngOnInit(): void {
    this.employeeService.getCountry().subscribe(data => {this.departments = data; });
    this.imagePreview = this.filePipe.transform(this.employee.photo, 'employees');
    this.form1 = new FormGroup({
      photo: new FormControl(this.employee.photo),
      cv: new FormControl(this.employee.cv),
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
    this.cv = this.employee.cv;
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
      _cellarIGSS: new FormControl(this.employee._cellarIGSS, Validators.required),
      details: new FormControl(this.employee.details, Validators.required),
      disability: new FormControl(this.employee.disability),
      foreignPermit: new FormControl(this.employee.foreignPermit),
      igssNumber: new FormControl(this.employee.igssNumber),
      contractLaw: new FormControl(this.employee.contractLaw),
      internalContract: new FormControl(this.employee.internalContract),
      confidentialityContract: new FormControl(this.employee.confidentialityContract),
      newContract: new FormControl(this.employee.newContract),
    });

    this.emergencyContact = this.employee.emergencyContact === null ? { name: null, phone: null } : this.employee.emergencyContact;

    this.vacations = this.employee.vacations;

    this.family = this.employee.family;

    this.loadEmployeeJobs();
    this.loadVacations();
    
  }






  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // OPERATION FUNCTIONS /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getMun() {
    this.muns = this.departments.find(d => d.name === this.form1.controls.department.value).mun;
  }

  cvChangeEvent(ev: any) {
    const FILE: FileInput = new FileInput([ev.target.files[0]], ', ');
    this.cv = ev.target.files[0];
    this.changed = true;
    this.form1.controls.cv.setValue(FILE);
  }

  removeCV() {
    this.cv = undefined;
    this.changed = false;
    this.form1.controls.cv.setValue(null);
  }

  downloadCV() {
    if (typeof(this.cv) === 'object') {

      const fr = new FileReader();
      const file = this.cv;
      fr.readAsArrayBuffer(file);
      fr.onload = function() {
        const blob = new Blob([fr.result])
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a")
        a.href = url 
        a.download = file.name;
        a.click();
      }
    }

    if (typeof(this.cv) === 'string') {
      this.downloadContract('cv', this.form1.controls.cv.value);
    }

    
  }

  downloadContract(collection: string, value: string) {
    const url = this.filePipe.transform(value, collection);
    console.log(url);
    window.open(url, '_download');
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


  newFileField(value: any, collection?): any {
    if (value === null) { return null; }
    if (value === undefined) { return null; }
    if (typeof(value) === 'string') {
      return value;
    }
    if (typeof(value) === 'object') {
      const FILE: FileInput = value;
      if (FILE) {
        return 'archivo.temp';
      } else {
        return null;
      }
    }

  }


  saveEmployee() {
    if (this.form1.invalid || this.form2.invalid) { return; }

    const FILE: FileInput = this.form1.controls.photo.value;
    this.form1.controls.photo.setValue(this.newFileField(this.form1.controls.photo.value, 'employees'));
    
    let FILECV: FileInput = this.form1.controls.cv.value;
    this.form1.controls.cv.setValue(this.newFileField(this.form1.controls.cv.value, 'cv'));
    if (this.form1.controls.cv.value === null) {
      FILECV = null;
    }
    
    const FILECONTRACT1: FileInput = this.form2.controls.contractLaw.value;
    this.form2.controls.contractLaw.setValue(this.newFileField(this.form2.controls.contractLaw.value, 'contractLaw'));
    const FILECONTRACT2: FileInput = this.form2.controls.internalContract.value;
    this.form2.controls.internalContract.setValue(this.newFileField(this.form2.controls.internalContract.value, 'internalContract'));
    const FILECONTRACT3: FileInput = this.form2.controls.confidentialityContract.value;
    this.form2.controls.confidentialityContract.setValue(this.newFileField(this.form2.controls.confidentialityContract.value, 'confidentialityContract'));
    const FILECONTRACT4: FileInput = this.form2.controls.newContract.value;
    this.form2.controls.newContract.setValue(this.newFileField(this.form2.controls.newContract.value, 'newContract'));

    

    const employee: EmployeeItem = { ...this.form1.value, ...this.form2.value, family: this.family, _id: this.employee._id, emergencyContact: this.emergencyContact };
    this.employeeService.update(employee).subscribe(data => {
      const promises = [];
      if (FILE) {
        if (FILE.files) {
          promises.push(this.upload(FILE, data.employee._id, 'employees'));
        }
      }
      if (FILECV) {
        if (FILECV.files) {
          promises.push(this.upload(FILECV, data.employee._id, 'cv'));
        }
      }
      
      
      if (FILECONTRACT1) { if (FILECONTRACT1.files) { promises.push(this.upload(FILECONTRACT1, data.employee._id, 'contractLaw'));  } }
      if (FILECONTRACT2) { if (FILECONTRACT2.files) { promises.push(this.upload(FILECONTRACT2, data.employee._id, 'internalContract'));  } }
      if (FILECONTRACT3) { if (FILECONTRACT3.files) { promises.push(this.upload(FILECONTRACT3, data.employee._id, 'confidentialityContract'));  } }
      if (FILECONTRACT4) { if (FILECONTRACT4.files) { promises.push(this.upload(FILECONTRACT4, data.employee._id, 'newContract'));  } }

      Promise.all(promises).then(data => {

        this.toasty.success('Empleado modificado exitósamente');
        this.employeeService.loadData();
        this.loading = false;
        this.closebar.emit(true);
      }).catch(err => {
        this.loading = false;
        this.employeeService.loadData();
        this.closebar.emit(true);
        this.toasty.error('Error subiendo archivos');
      });
     

    },err => { this.loading = false; });
  }



  upload(FILE, id, collection): Promise<any> {
    return this.uploadFileService.uploadFile(FILE.files[0], collection, id);
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



  addVacations() {
    if (this.formVacations.invalid) { return; }
    const FILE: FileInput = this.formVacations.controls.constancy.value;
    if (FILE) {
      this.formVacations.controls.constancy.setValue('archivo.temp');
    } else {
      this.formVacations.controls.constancy.setValue(null);
    }
    const vacations: VacationItem = {...this.formVacations.value, _employee: this.employee._id};
    this.employeeService.saveVacation(vacations).subscribe(data => {
      const promises = [];
      if (FILE) {
        if (FILE.files) {
          promises.push(this.upload(FILE, data.vacation._id, 'vacation'));
        }
      }
      Promise.all(promises).then(data => {

        this.loadVacations();
        this.toasty.success('Vacaciones registradas');
        this.formVacations.reset();
      }).catch(err => {
        this.toasty.error('No se pudo subir el archivo');
        this.formVacations.reset();
        this.loadVacations();
      });
      
    });

  }


  loadVacations() {
    this.employeeService.loadVacations(this.employee._id).subscribe(data => {
      this.vacations = data.vacations;
    });
  }


  removeVacations(vac: VacationItem) {
    this.employeeService.deleteVacation(vac._id).subscribe(data => {
      this.loadVacations();
    });
  }

}
