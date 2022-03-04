import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { ExpenseItem } from 'src/app/core/models/Expense';
import { ExpenseService } from '../../../../../core/services/httpServices/expense.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {

  name = new FormControl('', Validators.required)

  expensesSubscription: Subscription;
  expenses: ExpenseItem[];

  constructor(
    private expenseService: ExpenseService,
    private toastyService: ToastyService
  ) { }

  ngOnInit(): void {
    this.expensesSubscription = this.expenseService.readData().subscribe((data) => {
      this.expenses = data;
    });
  }

  ngAfterContentInit(): void {
    this.expenseService.loadData();
  }

  ngOnDestroy(): void {
    this.expensesSubscription?.unsubscribe();
  }

  save() {
    const NEW_EXPENSE: ExpenseItem = {
      name: this.name.value
    }
    this.expenseService.create(NEW_EXPENSE)
      .subscribe(resp => {
        this.toastyService.success('Gasto creado satisfactoriamente')
        this.expenseService.loadData();
        this.name.reset();
      })
  }

  remove(expense: ExpenseItem) {
    this.expenseService.delete(expense)
      .subscribe(resp => {
        this.toastyService.success('Gasto eliminado satisfactoriamente')
        this.expenseService.loadData();
      });
  }

}
