import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CellarItem } from 'src/app/core/models/Cellar';

@Component({
  selector: 'app-best-sellers',
  templateUrl: './best-sellers.component.html',
  styleUrls: ['./best-sellers.component.scss'],
})
export class BestSellersComponent implements OnInit {
  loading = false;
  cellar: CellarItem;

  data: any[] = [];

  dataSource = new MatTableDataSource();


  form = new FormGroup({
    startDate: new FormControl(new Date(), Validators.required),
    endDate: new FormControl(new Date(), Validators.required),
  });


  constructor() {}

  ngOnInit(): void {}

  getCellar(cellar: CellarItem): void {
    this.cellar = cellar;
  }

  applyFilter(filter: string): void {
    this.dataSource.filter = filter;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
