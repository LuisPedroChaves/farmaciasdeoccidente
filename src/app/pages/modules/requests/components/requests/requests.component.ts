import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { DiscountItem, TransactionItem } from 'src/app/core/models/Discounts';
import { EmployeeItem } from 'src/app/core/models/Employee';
import { RisingItem } from 'src/app/core/models/Risings';
import { DiscountsService } from 'src/app/core/services/httpServices/discounts.service';
import { EmployeeService } from 'src/app/core/services/httpServices/employee.service';
import { RisingsService } from 'src/app/core/services/httpServices/risings.service';
import { AppState } from 'src/app/store/app.reducer';
import { RequestDialogComponent } from '../request-dialog/request-dialog.component';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators'
import { EmployeeJobItem } from 'src/app/core/models/EmployeeJob';
@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  configsubscription: Subscription;

  risings: RisingItem[] = [];
  discounts: DiscountItem[] = [];
  transactions: TransactionItem[] = [];
  employee: EmployeeItem;
  smallScreen: boolean;


  displayedColumns: string[] = [ 'date', 'transactionType', 'approved', 'details'  ];
  dataSource = new MatTableDataSource([]);

  employeeJobs: EmployeeJobItem[] = [];
  loading: boolean = true;
  constructor(public discountsService: DiscountsService, public store: Store<AppState>, public risingsService: RisingsService, public dialog: MatDialog, public employeService: EmployeeService) { }

  ngOnInit(): void {

    this.configsubscription = this.store.select('config').pipe(filter(config => config !== null)).subscribe(config => {
        this.smallScreen = config.smallScreen;
    });
    this.employeService.getEmployeeJobsByUser().subscribe(data => {
      this.employee = data.employee;
      this.getRisingDiscounts();

      this.employeService.getEmployeeJobs(this.employee._id).subscribe(data2 => {
        this.employeeJobs = data2.employeeJobs;
      });
    });

  }





  getRisingDiscounts() {
    this.transactions = [];
    combineLatest([ this.risingsService.getRisingByEmployee(this.employee._id), this.discountsService.getDiscountsByEmployee(this.employee._id)]).subscribe(data => {
      this.risings = data[0].risings;
      this.discounts = data[1].discounts;


      this.risings.forEach((r) => this.transactions.push({...(r as any), transactionType: 'rising', approved: r.approved}));
      this.discounts.forEach((r) => this.transactions.push({...(r as any), transactionType: 'permission', approved: r.approved}));

      console.log(this.discounts);
      this.dataSource = new MatTableDataSource<TransactionItem>(this.transactions);


      this.loading = false;
    });
  }




  newRequest(type: string) {
    let title = 'Nueva Solicitud';
    switch(type ) {
      case 'citaIGSS': title = 'Nueva Cita del IGSS'; break;
      case 'permiso': title = 'Nuevo Permiso'; break;
      case 'diadescanso': title = 'Solicitud de cambio de día de descanso'; break;
      case 'horasExtra': title = 'Nuevo Ingreso de horas extras'; break;
      case 'asueto': title = 'Nuevo Asueto'; break;
    }
    const dialog = this.dialog.open(RequestDialogComponent, {
      width: this.smallScreen ? '100%' : '500px',
      data: { employeeJobs : this.employeeJobs, role: 'create', type: type, title: title},
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialog.afterClosed().subscribe(data => {
      if (data !== undefined) {
        this.getRisingDiscounts();
      }
    });
  }
}
