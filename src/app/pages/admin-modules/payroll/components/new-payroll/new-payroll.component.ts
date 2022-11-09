import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CellarItem } from 'src/app/core/models/Cellar';
import { PayrollDetailItem, PayrollItem } from 'src/app/core/models/Payroll';
import { CellarService } from 'src/app/core/services/httpServices/cellar.service';
import { PayrollService } from 'src/app/core/services/httpServices/payroll.service';
import { PrintService } from 'src/app/core/services/internal/print.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { PayrollPrintService } from '../../libs/payroll-print.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-new-payroll',
  templateUrl: './new-payroll.component.html',
  styleUrls: ['./new-payroll.component.scss']
})
export class NewPayrollComponent implements OnInit {
  @Input() smallScreen: boolean;

  selectedCellars: any[] = [];
  cellars: CellarItem[];

  bonusExpand: boolean = false;
  igssExpand: boolean = false;
  discountsExpand: boolean = false;


  payrollEmployees: PayrollDetailItem[] = [];
  payrollEmployeesCopy: PayrollDetailItem[] = [];
  payrollName: string = 'Nueva Planilla';
 
  





  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // HOOK FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  constructor(public router: Router, public cellarsService: CellarService, public printPayrollService: PayrollPrintService, public printService: PrintService, public payrollService: PayrollService, public toasty: ToastyService) { }

  ngOnInit(): void {
    this.cellarsService.readData().subscribe(data => {
      this.cellars = data;
      this.cellars.forEach(c => { 
        this.selectedCellars.push(c._id);
      });
      this.loadData();
    });

  }


  ngAfterContentInit() {
    this.cellarsService.loadData();
  }



  loadData() {
    this.payrollService.startPayroll(this.selectedCellars).subscribe(data => {
      this.payrollEmployees = data.details;
      this.payrollEmployeesCopy = data.details;
    });
  }


  back() {
    this.router.navigate(['admin', 'payroll']);
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
    if (this.payrollName === '' || this.payrollName === undefined || this.payrollName === null) {
      this.toasty.error('Debe agregar un nombre a la planilla');
      return;
    }

    const payroll: PayrollItem = {
      description: this.payrollName,
      date: (new Date()).toISOString(),
      total: this.getTotal(),
      state: 'created',
      details: [...this.payrollEmployees],
    };
    this.payrollService.createPayroll(payroll).subscribe(data => {
      this.toasty.success('Planilla generada exitósamente');
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
      date: (new Date()).toISOString(),
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
