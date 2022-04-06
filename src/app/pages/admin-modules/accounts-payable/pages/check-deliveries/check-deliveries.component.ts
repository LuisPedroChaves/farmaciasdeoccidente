import { Component, OnInit } from '@angular/core';

import { CheckItem } from 'src/app/core/models/Check';
import { CheckService } from 'src/app/core/services/httpServices/check.service';
import { FilterPipe } from 'src/app/core/shared/pipes/filterPipes/filter.pipe';

@Component({
  selector: 'app-check-deliveries',
  templateUrl: './check-deliveries.component.html',
  styleUrls: ['./check-deliveries.component.scss']
})
export class CheckDeliveriesComponent implements OnInit {

  loading = false;
  checksTemp: CheckItem[] = [];
  checks: CheckItem[] = [];

  constructor(
    private checkService: CheckService,
    private filter: FilterPipe
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.checkService.getDeliveries()
      .subscribe(resp => {
        this.checksTemp = resp.checks;
        this.checks = resp.checks;
        this.loading = false;
      });
  }

  applyFilter(text: string) {
    this.checks = this.filter.transform(this.checksTemp, text, ['no', 'date', 'name', 'amount', 'note']);
  }

  getDelivered(_id: string): void {
    this.checksTemp = this.checksTemp.filter(c => c._id !== _id);
    this.checks = this.checks.filter(c => c._id !== _id);
  }

}
