import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
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
import { UploadAvatarComponent } from '../upload-avatar/upload-avatar.component';


@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.scss']
})
export class NewEmployeeComponent implements OnInit {

  @Input() smallScreen: boolean;
  @Input() jobs: any[] = [];
  @Input() banks: BankItem[] = [];
  @Input() cellars: CellarItem[] = [];
  @Output() closebar = new EventEmitter<any>();

  departments: any[];
  muns: string[] = [];


  // STEP 1
  imagePreview: string;
  cv: any;
  vacations: VacationItem[] = [];
  changed: boolean = false;
  emergencyContact:  {name: string, phone: string } = { name: null, phone: null };
  loading: boolean = false;
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


  family: FamilyItem[] = [];

  constructor(public dialog: MatDialog, public employeeService: EmployeeService, public toasty: ToastyService, public uploadFileService: UploadFileService) { }

  ngOnInit(): void {
    this.employeeService.getCountry().subscribe(data => {this.departments = data; });
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
    const fr = new FileReader();
    const file = this.cv;
    fr.readAsArrayBuffer(file);
    fr.onload = function() {
      const blob = new Blob([fr.result])
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a")
      a.href = url 
      a.download = file.name;
      a.click()
    }

    
  }

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
    this.loading = true;
    
    const FILE: FileInput = this.form1.controls.photo.value;
    const FILECV: FileInput = this.form1.controls.cv.value;


    const FILECONTRACT1: FileInput = this.form2.controls.contractLaw.value;
    const FILECONTRACT2: FileInput = this.form2.controls.internalContract.value;
    const FILECONTRACT3: FileInput = this.form2.controls.confidentialityContract.value;
    const FILECONTRACT4: FileInput = this.form2.controls.newContract.value;
    if (FILE) {
      this.form1.controls.photo.setValue('archivo.temp');
    } else {
      this.form1.controls.photo.setValue(null);
    }
    if (FILECV) {
      this.form1.controls.cv.setValue('archivo.temp');
    } else {
      this.form1.controls.cv.setValue(null);
    }
    
    this.form2.controls.contractLaw.setValue(FILECONTRACT1 ? 'archivo.temp' : null);
    this.form2.controls.internalContract.setValue(FILECONTRACT2 ? 'archivo.temp' : null);
    this.form2.controls.confidentialityContract.setValue(FILECONTRACT3 ? 'archivo.temp' : null);
    this.form2.controls.newContract.setValue(FILECONTRACT4 ? 'archivo.temp' : null);



    const employee: EmployeeItem = { ...this.form1.value, ...this.form2.value, family: this.family, vacations: this.vacations, emergencyContact: this.emergencyContact };
    this.employeeService.create(employee).subscribe(data => {
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

        this.toasty.success('Empleado creado exitósamente');
        this.employeeService.loadData();
        this.loading = false;
        this.closebar.emit(true);
      }).catch(err => {
        this.loading = false;
        this.employeeService.loadData();
        this.closebar.emit(true);
        this.toasty.error('Error subiendo archivos');
      });

    }, err => { this.loading = false; });
  }





  upload(FILE, id, collection): Promise<any> {
    return this.uploadFileService.uploadFile(FILE.files[0], collection, id);
  }

}
