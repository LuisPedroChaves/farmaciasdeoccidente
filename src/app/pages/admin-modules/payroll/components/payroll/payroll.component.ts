import { AfterContentInit, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CellarItem } from 'src/app/core/models/Cellar';
import { CellarService } from 'src/app/core/services/httpServices/cellar.service';
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
  payrolls: any[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  cellars: CellarItem[];

  smallScreen: boolean;
  constructor(public store: Store<AppState>, public cellarService: CellarService) { }

  ngOnInit(): void {
    this.configsubscription = this.store.select('config').pipe(filter(config => config !== null)).subscribe(config => {
        this.smallScreen = config.smallScreen;
    });

    this.cellarsSubscription = this.cellarService.readData().subscribe(data => {
      this.cellars = data;
    });
  }

  ngAfterContentInit() {
    this.cellarService.loadData();
  }






  filter() {}

  newPayroll() {
    this.sideopen = true;
  }

}
