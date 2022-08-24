import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BankItem } from 'src/app/core/models/Bank';
import { CellarItem } from 'src/app/core/models/Cellar';
import { EmployeeItem, FamilyItem } from 'src/app/core/models/Employee';
import { EmployeeJobItem } from 'src/app/core/models/EmployeeJob';
import { EmployeeService } from 'src/app/core/services/httpServices/employee.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { NewEmployeeJobComponent } from '../new-employee-job/new-employee-job.component';
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
    city: new FormControl(null, Validators.required)
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
  });



  // STEP 3 
  form3 = new FormGroup({
    name: new FormControl(null, Validators.required),
    birth: new FormControl(null, Validators.required),
    type: new FormControl(null, Validators.required),
  });


  family: FamilyItem[] = [];

  constructor(public dialog: MatDialog, public employeeService: EmployeeService, public toasty: ToastyService) { }

  ngOnInit(): void {
    this.employeeService.getCountry().subscribe(data => {this.departments = data; });
  }






  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // OPERATION FUNCTIONS /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getMun() {
    this.muns = this.departments.find(d => d.name === this.form1.controls.department.value).mun;
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
        this.form1.controls.photo.setValue(data.file);
      }
    });
  }


  saveEmployee() {
    if (this.form1.invalid || this.form2.invalid) { return; }

    const employee: EmployeeItem = { ...this.form1.value, ...this.form2.value, family: this.family }
    this.employeeService.create(employee).subscribe(data => {

      this.toasty.success('Empleado creado exitósamente');
      this.employeeService.loadData();
      this.closebar.emit(true);

    });
  }

  // addJob() {
  //   const dialogRef = this.dialog.open(NewEmployeeJobComponent, {
  //     width: this.smallScreen ? '100%' : '450px',
  //     panelClass: ['farmacia-dialog', 'farmacia'],
  //     data: { jobs: this.jobs }
  //   });


  //   dialogRef.afterClosed().subscribe(data => {

  //   });
  // }

}
