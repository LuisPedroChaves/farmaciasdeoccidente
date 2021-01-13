import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-select-order',
  templateUrl: './select-order.component.html',
  styleUrls: ['./select-order.component.scss']
})
export class SelectOrderComponent implements OnInit {
  editMode = false;

  configSubscription: Subscription;
  sessionsubscription: Subscription;
  smallScreen = window.innerWidth < 960 ? true : false;

  form = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    dpi: new FormControl(null, [Validators.required]),
    birthDate: new FormControl(null),
    startDate: new FormControl(null, [Validators.required]),
    phone1: new FormControl(null),
    phone2: new FormControl(null),
    address: new FormControl(null),
    account: new FormControl(null),
    igss_number: new FormControl(null),
    contract: new FormControl(0),
    _degree: new FormControl(null, [Validators.required]),
  });

  degrees: any[];
  employeejobs: any[] = [];

  // jobs
  jobs: any[];
  campus: any[];

  image = 'assets/images/avatars/00M.jpg';
  selectedOrder: any;
  allservices;

  constructor(
    // public store: Store<AppState>,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public toasty: ToastyService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    // this.sessionsubscription = this.store.select('session').pipe(filter( session => session !== null)).subscribe( session => {
    //   if (session.permissions !== null) {
    //     const b = session.permissions.filter(pr => pr.name === 'contracts');
    //     this.employeesp = b.length > 0 ? b[0].options : [];

    //   }
    // });
    // this.allservices = combineLatest([
    //   this.employeeService.getDegrees(),
    //   this.jobsService.readData(),
    //   this.campusService.readData()
    // ]).subscribe(data => {
    //   this.degrees = data[0].degrees;
    //   this.jobs = data[1];
    //   this.campus = data[2];
    //   this.activatedRoute.params.subscribe( ({ id }) => {
    //     this.employeeService.getEmployee(id).subscribe(datae => {
    //       this.selectedEmployee  = datae.employee;
    //       this.image = this.selectedEmployee.image;
    //       this.pasteEmployee();
    //     });
    //   });
    // });
    this.selectedOrder = {
        invoiceNumber: '5',
        nit: '730613-k',
        name: 'Farmacia1',
        address: '|Ciudad',
        phone: '2535354',
        town: 'almolonga',
        department: 'quetzaltenago',
        paymentMethod: '100',
        total: '300',
        details: 'detallesgfklgfuyglgñigiuj',
        image: 'imagen2.jpg',
        state:'entregado',
        timestamps: '25Days',
        timeOrder:'30Days',
        timeDispatch: '2Days',
        timeSend:'5Days',
        noOrder:'125',
        _id:'123',
        isActive:true
    }
  }

  pasteEmployee() {
    // this.form = new FormGroup({
    //   name: new FormControl(this.selectedEmployee.name, [Validators.required]),
    //   dpi: new FormControl(this.selectedEmployee.dpi, [Validators.required]),
    //   birthDate: new FormControl(this.selectedEmployee.birthDate),
    //   startDate: new FormControl(this.selectedEmployee.startDate, [Validators.required]),
    //   phone1: new FormControl(this.selectedEmployee.phone1),
    //   phone2: new FormControl(this.selectedEmployee.phone2),
    //   address: new FormControl(this.selectedEmployee.address),
    //   account: new FormControl(this.selectedEmployee.account),
    //   igss_number: new FormControl(this.selectedEmployee.igss_number),
    //   contract: new FormControl(this.selectedEmployee.contract),
    //   _degree: new FormControl(this.selectedEmployee._degree, [Validators.required]),
    // });
    // this.employeejobs = this.selectedEmployee.jobs;
  }

  addJob() {
    // const dialogRef = this.dialog.open(AssignJobComponent, {
    //   width: this.smallScreen === true ? '100%' : '500px',
    //   data: { jobs: this.jobs, campus: this.campus, degree: this.form.controls._degree.value },
    //   panelClass: ['iea-dialog' ],
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result !== undefined) {
    //     this.employeejobs.push(result);
    //   }
    // });
  }


  removeJob(index) {
    this.employeejobs.splice(index, 1);
  }


  saveEmployee() {
    // this.markFormGroupTouched(this.form);
    // if (this.form.invalid) { return; }
    // const newemployee: EmployeeItem = {...this.form.value, jobs: this.employeejobs, image: this.image, _id: this.selectedEmployee._id };
    // this.employeeService.update(newemployee).subscribe(data => {
    //   this.toasty.success('Empleado modificado exitósamente');
    //   this.router.navigate(['/employees/employees']);
    // }, err => {
    //   this.toasty.error('Error al modificar', 'Hubo un problema al modificar el empleado, intente de nuevo más tarde.');
    // });
  }


  private markFormGroupTouched(formGroup: FormGroup): void {
    // (Object as any).values(formGroup.controls).forEach(control => {
    //   control.markAsTouched();

    //   if (control.controls) {
    //     this.markFormGroupTouched(control);
    //   }
    // });
  }


  delete() {
    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   width: '350px',
    //   data: { title: 'Eliminar Empleado', message: '¿Confirma que desea eliminar al empleado ' + this.selectedEmployee.name + '?'},
    //   disableClose: true,
    //   panelClass: ['iea-dialog' ],
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result !== undefined) {
    //     if (result === true) {
    //       this.employeeService.delete(this.selectedEmployee).subscribe(data => {
    //         this.toasty.success('Empleado Eliminado');
    //         this.router.navigate(['/employees/employees']);
    //       });
    //     }
    //   }
    // });
  }


  uploadImage() {
    // const dialogRef = this.dialog.open(CropUploadImageComponent, {
    //   width: this.smallScreen ? '100%' : '550px',
    //   data: { },
    //   disableClose: true,
    //   panelClass: ['iea-dialog' ],
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result !== undefined) {
    //     this.image = result;
    //   }
    // });
  }


  addDegree() {
    // const dialogRef = this.dialog.open(AddDegreeComponent, {
    //   width: this.smallScreen ? '100%' : '350px',
    //   data: { },
    //   disableClose: true,
    //   panelClass: ['iea-dialog' ],
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result !== undefined) {
    //     if (result === true) {

    //       this.employeeService.getDegrees().subscribe(data => {
    //         this.degrees = data.degrees;
    //       });
    //     }
    //   }
    // });
  }

}
