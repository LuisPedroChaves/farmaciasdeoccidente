import { Component, OnInit, Input, AfterContentInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { AccountsPayableService } from 'src/app/core/services/httpServices/accounts-payable.service';
import { AccountsPayableItem } from '../../../../../core/models/AccountsPayable';
import { ProviderItem } from '../../../../../core/models/Provider';
import { ProviderService } from '../../../../../core/services/httpServices/provider.service';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { ExpenseItem } from '../../../../../core/models/Expense';
import { ExpenseService } from '../../../../../core/services/httpServices/expense.service';

@Component({
  selector: 'app-new-edit',
  templateUrl: './new-edit.component.html',
  styleUrls: ['./new-edit.component.scss']
})
export class NewEditComponent implements OnInit, AfterContentInit, OnDestroy {

  @Input() accountsPayable: AccountsPayableItem;
  @Output() close = new EventEmitter();
  @ViewChild('Iamount') Iamount: ElementRef<HTMLInputElement>;

  loading = false;
  form = new FormGroup({
    _provider: new FormControl(null, Validators.required),
    _purchase: new FormControl(null),
    _expense: new FormControl(null),
    date: new FormControl('', Validators.required),
    serie: new FormControl(),
    noBill: new FormControl('', Validators.required),
    docType: new FormControl('FACTURA', Validators.required),
    unaffectedAmount: new FormControl(0, Validators.required),
    exemptAmount: new FormControl(0, Validators.required),
    netPurchaseAmount: new FormControl(0, Validators.required),
    netServiceAmount: new FormControl(0, Validators.required),
    otherTaxes: new FormControl(0, Validators.required),
    iva: new FormControl(0, Validators.required),
    total: new FormControl(0, Validators.required),
    type: new FormControl('PRODUCTOS', Validators.required),
    file: new FormControl(''),
    toCredit: new FormControl(false, Validators.required),
    expirationCredit: new FormControl(null),
    paid: new FormControl(false, Validators.required)
  })

  providersSubscription: Subscription;
  providers: ProviderItem[];
  filteredOptions: Observable<ProviderItem[]>;
  provider = new FormControl(null, Validators.required);

  expensesSubscription: Subscription;
  expenses: ExpenseItem[];
  filteredExpenses: Observable<ExpenseItem[]>;

  amount = new FormControl('', Validators.required);
  amountType = new FormControl('NO-AFECTAS', Validators.required);
  displayedColumns: string[] = ['1', '2', '3', '4', '5', '6'];
  dataSource = [
    {
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
    }
  ];

  constructor(
    private providerService: ProviderService,
    private toastyService: ToastyService,
    private expenseService: ExpenseService,
    private accountsPayableService: AccountsPayableService,
  ) { }

  ngOnInit(): void {
    this.providersSubscription = this.providerService.readData().subscribe((data) => {
      this.providers = data;
    });
    this.expensesSubscription = this.expenseService.readData().subscribe((data) => {
      this.expenses = data;
    });

    this.filteredOptions = this.provider.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterProviders(value))
    );
    this.filteredExpenses = this.form.controls._expense.valueChanges.pipe(
      startWith(''),
      map((value: any) => {
        if (typeof value === 'string' || !value) {
          return this._filterExpenses(value)
        } else {
          return this._filterExpenses(value.name)
        }
      })
    );
  }

  ngAfterContentInit(): void {
    this.providerService.loadData();
    this.expenseService.loadData();
  }

  ngOnDestroy(): void {
    this.providersSubscription?.unsubscribe();
    this.expensesSubscription?.unsubscribe();
  }

  private _filterProviders(value: string): ProviderItem[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.providers.filter((option) =>
        option.nit.toLowerCase().includes(filterValue)
      );
    } else {
      return [];
    }
  }

  private _filterExpenses(value: string): ExpenseItem[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.expenses.filter((option) =>
        option.name.toLowerCase().includes(filterValue)
      );
    } else {
      return [];
    }
  }

  getName(expense: ExpenseItem): string {
    return expense ? expense.name : '';
  }

  selectProvider(nit: string) {
    const PROVIDER = this.providers.find(p => p.nit === nit);

    if (PROVIDER) {
      this.form.controls._provider.setValue(PROVIDER);
    }
  }

  getTotal(type: string): number {
    if (type === 'AFECTO') {
      return +this.form.controls.netPurchaseAmount.value +
        +this.form.controls.netServiceAmount.value +
        +this.form.controls.iva.value;
    } else if (type === 'GENERAL') {
      return +this.form.controls.unaffectedAmount.value +
        +this.form.controls.exemptAmount.value +
        +this.form.controls.netPurchaseAmount.value +
        +this.form.controls.netServiceAmount.value +
        +this.form.controls.otherTaxes.value +
        +this.form.controls.iva.value;
    }
  }

  applyAmount() {
    if (this.amount.value <= 0) {
      this.toastyService.error(`${this.amount.value} no es monto valido`)
      return;
    }

    const TYPES = {
      'NO-AFECTAS': () => {
        this.form.controls.unaffectedAmount.setValue(this.amount.value)
      },
      'EXENTOS': () => {
        this.form.controls.exemptAmount.setValue(this.amount.value)
      },
      'COMPRAS': () => {
        let current_iva = Number(this.form.controls.iva.value);
        // Restar iva anterior
        const LAST_IVA = ((this.form.controls.netPurchaseAmount.value * 1.12) * 0.12) / 1.12;
        current_iva = current_iva - LAST_IVA
        this.form.controls.iva.setValue(current_iva.toFixed(2));
        // Calculamos el nuevo iva
        const IVA = (this.amount.value * 0.12) / 1.12;
        this.form.controls.netPurchaseAmount.setValue((this.amount.value - IVA).toFixed(2))
        current_iva = current_iva + IVA
        this.form.controls.iva.setValue((current_iva).toFixed(2));
      },
      'SERVICIOS': () => {
        let current_iva = Number(this.form.controls.iva.value);
        // Restar iva anterior
        const LAST_IVA = ((this.form.controls.netServiceAmount.value * 1.12) * 0.12) / 1.12;
        current_iva = current_iva - LAST_IVA
        this.form.controls.iva.setValue(current_iva.toFixed(2));
        // Calculamos el nuevo iva
        const IVA = (this.amount.value * 0.12) / 1.12;
        this.form.controls.netServiceAmount.setValue((this.amount.value - IVA).toFixed(2))
        current_iva = current_iva + IVA
        this.form.controls.iva.setValue((current_iva).toFixed(2));
      },
      'TAXES': () => {
        this.form.controls.otherTaxes.setValue(this.amount.value)
      },
    }

    TYPES[this.amountType.value]();
    this.amount.reset();
    this.Iamount.nativeElement.focus();
  }

  resetTable() {
    this.form.controls.unaffectedAmount.setValue(0);
    this.form.controls.exemptAmount.setValue(0);
    this.form.controls.netPurchaseAmount.setValue(0);
    this.form.controls.netServiceAmount.setValue(0);
    this.form.controls.iva.setValue(0);
    this.form.controls.otherTaxes.setValue(0);
  }

  resetForm() {
    this.form.reset({
      _provider: null,
      _purchase: null,
      _expense: null,
      date: '',
      serie: '',
      noBill: '',
      docType: 'FACTURA',
      unaffectedAmount: 0,
      exemptAmount: 0,
      netPurchaseAmount: 0,
      netServiceAmount: 0,
      otherTaxes: 0,
      iva: 0,
      total: 0,
      type: 'PRODUCTOS',
      file: '',
      toCredit: false,
      expirationCredit: null,
      paid: false
    });
  }

  save() {
    this.loading = true;
    // Asignamos el tipo de factura si es PRODUCTOS | GASTOS
    this.form.controls.type.setValue(this.accountsPayable.type);
    if (!this.form.controls.toCredit.value) {
      // Validamos si la factura es al contado para marcarla como pagada
      this.form.controls.paid.setValue(true);
    }
    if (this.accountsPayable._id) {
      // Editando...

    } else {
      // Creando nueva...
      this.accountsPayableService.create({ ...this.form.value })
        .subscribe(resp => {
          console.log("🚀 ~ file: new-edit.component.ts ~ line 258 ~ NewEditComponent ~ save ~ resp", resp)
          this.toastyService.success('Documento ingresado correctamente')
          this.resetForm();
          this.loading = false;
          this.close.emit();
        })
    }
  }

}
