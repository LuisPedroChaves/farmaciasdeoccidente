import { AfterContentInit, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CellarItem } from 'src/app/core/models/Cellar';
import { PayrollItem } from 'src/app/core/models/Payroll';
import { CellarService } from 'src/app/core/services/httpServices/cellar.service';
import { PayrollService } from 'src/app/core/services/httpServices/payroll.service';
import { AppState } from 'src/app/store/app.reducer';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss']
})
export class PayrollComponent implements OnInit, AfterContentInit {

  configsubscription:  Subscription;
  cellarsSubscription:  Subscription;
  sideopen: boolean = false;
  payrolls: PayrollItem[] = [];
  cellars: CellarItem[];

  smallScreen: boolean;
  constructor(public store: Store<AppState>, public cellarService: CellarService, public payrollService: PayrollService) { }

  ngOnInit(): void {
    this.configsubscription = this.store.select('config').pipe(filter(config => config !== null)).subscribe(config => {
        this.smallScreen = config.smallScreen;
    });

    this.cellarsSubscription = this.cellarService.readData().subscribe(data => {
      this.cellars = data;
    });

    this.payrollService.readData().subscribe(data => { this.payrolls = data });
  }

  ngAfterContentInit() {
    this.cellarService.loadData();
    this.payrollService.getData();
  }






  filter() {}

  newPayroll() {
    this.sideopen = true;
  }

}
