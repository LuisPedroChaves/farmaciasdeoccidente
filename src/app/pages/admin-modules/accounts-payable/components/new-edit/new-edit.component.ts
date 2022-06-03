import { Component, OnInit, Input, AfterContentInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';

import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FileInput } from 'ngx-material-file-input';

import { AccountsPayableService } from 'src/app/core/services/httpServices/accounts-payable.service';
import { UploadFileService } from 'src/app/core/services/httpServices/upload-file.service';
import { CheckService } from 'src/app/core/services/httpServices/check.service';
import { CheckItem } from 'src/app/core/models/Check';
import { AccountsPayableBalanceItem, AccountsPayableItem } from '../../../../../core/models/AccountsPayable';
import { ToastyService } from '../../../../../core/services/internal/toasty.service';
import { ExpenseItem } from '../../../../../core/models/Expense';
import { ExpenseService } from '../../../../../core/services/httpServices/expense.service';
import { ProviderItem } from '../../../../../core/models/Provider';

@Component({
  selector: 'app-new-edit',
  templateUrl: './new-edit.component.html',
  styleUrls: ['./new-edit.component.scss']
})
export class NewEditComponent implements OnInit, AfterContentInit, OnDestroy, OnChanges {

  @Input() accountsPayable: AccountsPayableItem;
  @Output() close = new EventEmitter();
  @ViewChild('Iamount') Iamount: ElementRef<HTMLInputElement>;
  @ViewChild('drawer') drawer: MatDrawer;

  loading = false;
  drawerComponent = 'Gastos';

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
    emptyWithholdingIVA: new FormControl(false, Validators.required),
    emptyWithholdingISR: new FormControl(false, Validators.required),
    additionalDiscount: new FormControl(false, Validators.required),
    toCredit: new FormControl(true, Validators.required),
    expirationCredit: new FormControl(null),
    paid: new FormControl(false, Validators.required)
  })

  /* #region  Pago al contado */
  paymentMethod = 'CHEQUE';
  formPay = new FormGroup({
    date: new FormControl('', Validators.required),
    document: new FormControl(''),
    credit: new FormControl('CHEQUE', Validators.required),
    amount: new FormControl(0, Validators.required)
  })
  formCheck = new FormGroup({
    no: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    note: new FormControl(''),
    bank: new FormControl('BANRURAL', Validators.required),
    state: new FormControl('INTERBANCO', Validators.required),
  })

  /* #endregion */
  expensesSubscription: Subscription;
  expenses: ExpenseItem[];
  filteredExpenses: Observable<ExpenseItem[]>;
  tempExpense = '';

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
    private toastyService: ToastyService,
    private expenseService: ExpenseService,
    private accountsPayableService: AccountsPayableService,
    private uploadFileService: UploadFileService,
    private checkService: CheckService
  ) { }

  ngOnInit(): void {
    this.expensesSubscription = this.expenseService.readData().subscribe((data) => {
      this.expenses = data;
    });
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
    this.expenseService.loadData();
  }

  ngOnDestroy(): void {
    this.expensesSubscription?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.accountsPayable) {
      let { _id, _provider, _purchase, _expense, date, serie, noBill, docType, unaffectedAmount, exemptAmount, netPurchaseAmount, netServiceAmount, otherTaxes, iva, total, type, file, emptyWithholdingIVA, emptyWithholdingISR, additionalDiscount, toCredit, expirationCredit, paid } = changes.accountsPayable.currentValue;
      if (_id) {
        // Si existe el id entonces editamos la cuenta por pagar
        this.form.controls._provider.setValue(_provider);
        this.form.controls._purchase.setValue(_purchase);
        this.form.controls._expense.setValue(_expense);
        this.form.controls.date.setValue(date);
        this.form.controls.serie.setValue(serie);
        this.form.controls.noBill.setValue(noBill);
        if (docType === 'CREDITO_TEMP') {
          docType = 'CREDITO'
        }
        this.form.controls.docType.setValue(docType);
        this.form.controls.unaffectedAmount.setValue(unaffectedAmount);
        this.form.controls.exemptAmount.setValue(exemptAmount);
        this.form.controls.netPurchaseAmount.setValue(netPurchaseAmount);
        this.form.controls.netServiceAmount.setValue(netServiceAmount);
        this.form.controls.otherTaxes.setValue(otherTaxes);
        this.form.controls.iva.setValue(iva);
        this.form.controls.total.setValue(total);
        this.form.controls.type.setValue(type);
        this.form.controls.file.setValue(file);
        this.form.controls.emptyWithholdingIVA.setValue(emptyWithholdingIVA);
        this.form.controls.emptyWithholdingISR.setValue(emptyWithholdingISR);
        this.form.controls.additionalDiscount.setValue(additionalDiscount);
        this.form.controls.toCredit.setValue(toCredit);
        this.form.controls.expirationCredit.setValue(expirationCredit);
        this.form.controls.paid.setValue(paid);
      }
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

  /* #region  Providers */
  newProvider(): void {
    this.drawerComponent = 'Proveedores';
    this.drawer.toggle()
  }

  getProvider(provider: ProviderItem) {
    this.form.controls._provider.setValue(provider);
    if (provider) {
      this.formCheck.controls.name.setValue(provider.checkName)
    }
    if (this.drawer.opened) {
      this.drawer.opened = false;
    }
  }
  /* #endregion */

  /* #region  Expenses */
  newExpense(): void {
    this.tempExpense = this.form.controls._expense.value;
    this.drawerComponent = 'Gastos';
    this.drawer.toggle()
  }

  getExpense(expense: ExpenseItem): void {
    this.form.controls._expense.setValue(expense);
  }
  /* #endregion */

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

  resetForms() {
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
      emptyWithholdingIVA: false,
      emptyWithholdingISR: false,
      additionalDiscount: false,
      toCredit: true,
      expirationCredit: null,
      paid: false
    });
    this.formPay.reset();
    this.formCheck.reset({
      bank: 'BANRURAL',
      state: 'INTERBANCO'
    });
  }

  save() {
    const TOTAL = this.getTotal('GENERAL');
    if (TOTAL <= 0) {
      this.toastyService.error('El total general debe ser mayor a cero.')
      return;
    }
    this.loading = true;
    // Asignamos el tipo de factura si es PRODUCTOS | GASTOS
    // Asignamos el total general
    this.form.controls.type.setValue(this.accountsPayable.type);
    this.form.controls.total.setValue(TOTAL);

    // Manejo de archivo
    const FILE: FileInput = this.form.controls.file.value;
    if (FILE) {
      this.form.controls.file.setValue('archivo.temp');
    } else {
      this.form.controls.file.setValue(null);
    }

    if (this.accountsPayable._id) {
      // Editar
      this.accountsPayableService.update({
        ...this.form.value,
        _id: this.accountsPayable._id
      })
        .subscribe(resp => {
          // Manejo de archivo
          if (FILE) {
            if (FILE.files) {
              this.uploadFileService.uploadFile(FILE.files[0], 'accountsPayable', resp.accountsPayable._id)
                .then((resp: any) => {
                  this.saveSuccess();
                })
                .catch(err => {
                  this.loading = false;
                  this.toastyService.error('Error al cargar el archivo');
                });
            }else {
              this.saveSuccess();
            }
          } else {
            this.saveSuccess();
          }
        })
    } else {
      // Nueva
      /* #region  Validaciones */
      const TO_CREDIT = this.form.controls.toCredit.value
      const DOC_TYPE = this.form.controls.docType.value
      const PROVIDER: ProviderItem = this.form.controls._provider.value
      const NEW_BALANCES: AccountsPayableBalanceItem[] = [];

      if (DOC_TYPE !== 'ABONO' && DOC_TYPE !== 'CREDITO' && DOC_TYPE !== 'CREDITO_TEMP') {
        if (PROVIDER.iva && TOTAL >= 2500) {
          // Si el proveedor tiene retencion de iva entonces será obligatoria
          this.form.controls.emptyWithholdingIVA.setValue(true);
        }
        if (PROVIDER.isr && TOTAL >= 2500) {
          // Si el proveedor tiene retencion de isr entonces será obligatoria
          this.form.controls.emptyWithholdingISR.setValue(true);
        }
        if (!TO_CREDIT) {
          // Validamos si la factura es al contado y que no sea pago con cheque para marcarla como pagada
          if (this.paymentMethod !== 'CHEQUE') {
            this.form.controls.paid.setValue(true);
            this.formPay.controls.credit.setValue(this.paymentMethod);
            this.formPay.controls.amount.setValue(TOTAL);
            NEW_BALANCES.push({ ...this.formPay.value });
          } else {
            // Si es al contado y se paga con cheque
            if (this.accountsPayable.type === 'PRODUCTOS') {
              // Si es un documento de productos entonces los estados del cheque cambian
              this.formCheck.controls.bank.setValue('INTERBANCO');
              this.formCheck.controls.state.setValue('CREADO');
            } else if (this.accountsPayable.type === 'GASTOS') {
              // Si es un documento de gastos entonces los estados del cheque cambian
              this.formCheck.controls.bank.setValue('BANRURAL');
              this.formCheck.controls.state.setValue('ESPERA');
            }
          }
        }
      }
      /* #endregion */

      this.accountsPayableService.create({
        ...this.form.value,
        balance: NEW_BALANCES
      })
        .subscribe(resp => {
          // Manejo de archivo
          if (FILE) {
            this.uploadFileService.uploadFile(FILE.files[0], 'accountsPayable', resp.accountsPayable._id)
              .then((resp: any) => {
                if (!TO_CREDIT && this.paymentMethod === 'CHEQUE') {
                  this.saveCheck(TOTAL, resp.accountsPayable)
                } else {
                  this.saveSuccess();
                }
              })
              .catch(err => {
                this.loading = false;
                this.toastyService.error('Error al cargar el archivo');
              });
          } else {
            if (!TO_CREDIT && this.paymentMethod === 'CHEQUE') {
              this.saveCheck(TOTAL, resp.accountsPayable)
            } else {
              this.saveSuccess();
            }
          }
        })
    }
  }

  saveCheck(total: number, accountPayable: AccountsPayableItem): void {
    // const CHECK: CheckItem = {
    //   no: this.formCheck.controls.no.value,
    //   city: this.formCheck.controls.city.value,
    //   date: this.formCheck.controls.date.value,
    //   name: this.formCheck.controls.name.value,
    //   amount: total,
    //   accountsPayables: [{ ...accountPayable }],
    //   note: this.formCheck.controls.note.value,
    //   bank: this.formCheck.controls.bank.value,
    //   state: this.formCheck.controls.state.value,
    // }
    // this.checkService.create(CHECK)
    //   .subscribe(resp => {
    //     this.checkService.print(resp.check)
    //     this.saveSuccess();
    //   });
  }

  saveSuccess(): void {
    this.toastyService.success('Documento ingresado correctamente')
    this.resetForms();
    this.loading = false;
    this.close.emit();
  }

}
