import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CellarItem } from 'src/app/core/models/Cellar';
import { PayrollDetailItem, PayrollItem } from 'src/app/core/models/Payroll';
import { CellarService } from 'src/app/core/services/httpServices/cellar.service';
import { PayrollService } from 'src/app/core/services/httpServices/payroll.service';
import { PrintService } from 'src/app/core/services/internal/print.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { PayrollPrintService } from '../../libs/payroll-print.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationComponent } from 'src/app/pages/shared-components/confirmation/confirmation.component';
@Component({
  selector: 'app-edit-payroll',
  templateUrl: './edit-payroll.component.html',
  styleUrls: ['./edit-payroll.component.scss']
})
export class EditPayrollComponent implements OnInit, OnDestroy {

  smallScreen: boolean;

  selectedCellars: any[] = [];

  bonusExpand: boolean = false;
  igssExpand: boolean = false;
  discountsExpand: boolean = false;


  payroll: PayrollItem;
  payrollEmployees: PayrollDetailItem[] = [];
  payrollEmployeesCopy: PayrollDetailItem[] = [];
  payrollName: string = 'Nueva Planilla';
  payrollState: string;
  activatedSubscription: Subscription;





  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // HOOK FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  constructor(public router: Router, public cellarsService: CellarService, public dialog: MatDialog, public printPayrollService: PayrollPrintService, public printService: PrintService, public activatedRoute: ActivatedRoute, public payrollService: PayrollService, public toasty: ToastyService) { }

  ngOnInit(): void {
    this.activatedSubscription = this.activatedRoute.params.subscribe((params) => {
      this.payrollService.gePayroll(params.id).subscribe(data => {
        console.log('PAYROLL', data.payroll);
        this.payroll = data.payroll;
        this.payrollEmployees = this.payroll.details.map(d => ({...d}));
        this.payrollName = this.payroll.description;
      });
    });
   

  }

  ngOnDestroy(): void {
    this.activatedSubscription?.unsubscribe();
  }


  ngAfterContentInit() {
  }



  


  back() {
    this.router.navigate(['admin', 'payroll']);
  }



  deletePayroll() {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '350px',
      data : { title: 'Eliminar Planilla', msg: '¿Confirma que desea eliminar esta planilla?' }
    });
     dialogRef.afterClosed().subscribe(DATA =>{
      if (DATA ===true) {
        this.payrollService.delete(this.payroll._id).subscribe(datas => {
          this.toasty.success('Planilla eliminada');
          this.payrollService.loadData();
          this.back();
        })
      }
     });
  }










  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // PAYROLL FUNCTIONS ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getTotal(): number {
    return this.payrollEmployees.reduce((partial_sum, p) =>  {
      const etotal = (((p._employeeJob as any).initialSalary) + (p.extraHours + p.incentiveBonus + p.jobBonus + p.otherBonus) - (p.igss) - (p.productCharges + p.credits + p.foults))
      return partial_sum + etotal;
    }, 0);
  }
  generatePayroll() {
    if (this.payroll.state !== 'created') { 

      this.toasty.error('No se pueden guardar cambios', 'Esta planilla no se puede actualizar debido a que ya fue pagada');
      return;
    }
    if (this.payrollName === '' || this.payrollName === undefined || this.payrollName === null) {
      this.toasty.error('Debe agregar un nombre a la planilla');
      return;
    }

    const payroll: PayrollItem = {
      _id: this.payroll._id,
      description: this.payrollName,
      date: (new Date()).toISOString(),
      total: this.getTotal(),
      state: 'created',
      details: [...this.payrollEmployees],
    };
    this.payrollService.updatePayroll(payroll).subscribe(data => {
        this.toasty.success('Planilla guardarda exitósamente');
        this.payrollService.loadData();
        this.back();
    });
  }
    



  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // PRINT FUNCTIONS /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async printPayroll() {
    if (this.payrollName === '' || this.payrollName === undefined || this.payrollName === null) {
      return;
    }
    const payroll: PayrollItem = {
      description: this.payrollName,
      date: this.payroll.date,
      total: this.getTotal(),
      state: 'created',
      details: [...this.payrollEmployees],
    };
    const body = await this.printPayrollService.printMonthlyPayroll(payroll);
    this.printService.printLandscape(body);
  }

  async printReceipts() {
    if (this.payrollName === '' || this.payrollName === undefined || this.payrollName === null) {
      return;
    }
    const payroll: PayrollItem = {
      description: this.payrollName,
      date: (new Date()).toISOString(),
      total: this.getTotal(),
      state: 'created',
      details: [...this.payrollEmployees],
    };
    const body = await this.printPayrollService.printReceipts(payroll);
    this.printService.printPortrait(body);
  }

  async printReceipt(p: PayrollDetailItem) {
    if (this.payrollName === '' || this.payrollName === undefined || this.payrollName === null) {
      return;
    }
    const payroll: PayrollItem = {
      description: this.payrollName,
      date: (new Date()).toISOString(),
      total: this.getTotal(),
      state: 'created',
      details: [{...p}],
    };
    const body = await this.printPayrollService.printReceipts(payroll);
    this.printService.printPortrait(body);
  }

  async printIGSS() {
    if (this.payrollName === '' || this.payrollName === undefined || this.payrollName === null) {
      return;
    }
    const payroll: PayrollItem = {
      description: this.payrollName,
      date: (new Date()).toISOString(),
      total: this.getTotal(),
      state: 'created',
      details: [...this.payrollEmployees],
    };
    const body = await this.printPayrollService.printIGSS(payroll);
    this.printService.printLandscape(body);
  }
    
    
   

}
