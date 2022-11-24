import { AfterContentInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CellarItem } from 'src/app/core/models/Cellar';
import { DiscountItem } from 'src/app/core/models/Discounts';
import { EmployeeItem } from 'src/app/core/models/Employee';
import { EmployeeJobItem } from 'src/app/core/models/EmployeeJob';
import { RisingItem } from 'src/app/core/models/Risings';
import { CellarService } from 'src/app/core/services/httpServices/cellar.service';
import { DiscountsService } from 'src/app/core/services/httpServices/discounts.service';
import { EmployeeService } from 'src/app/core/services/httpServices/employee.service';
import { RisingsService } from 'src/app/core/services/httpServices/risings.service';
import { AppState } from 'src/app/store/app.reducer';
import { NewDiscountComponent } from '../new-discount/new-discount.component';
import { NewRisingComponent } from '../new-rising/new-rising.component';

@Component({
  selector: 'app-employee-transactions',
  templateUrl: './employee-transactions.component.html',
  styleUrls: ['./employee-transactions.component.scss']
})
export class EmployeeTransactionsComponent implements OnInit, AfterContentInit {

  configsubscription: Subscription;
  smallScreen: boolean;
  employees: EmployeeItem[] = [];

  // DISCOUNTS /////////
  discounts: DiscountItem[] = [];
  foults: DiscountItem[] = [];
  permissions: DiscountItem[] = [];
  retentions: DiscountItem[] = [];
  IGSSsuspentions: DiscountItem[] = [];
  lows: DiscountItem[] = [];
  temporalSuspention: DiscountItem[] = [];
  citaIGSS: DiscountItem[] = [];
  alertsCalls: DiscountItem[] = [];
  
  
  // RISINGS ///////////
  extraHours: RisingItem[] = [];
  holidays: RisingItem[] = [];
  comissions: RisingItem[] = [];
  bonus: RisingItem[] = [];
  rising: RisingItem[] = [];
  risings: RisingItem[] = [];







  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // HOOK FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  constructor(public dialog: MatDialog, public cellarService: CellarService, public store: Store<AppState>, public discountsService: DiscountsService, public risingsService: RisingsService, public employeService: EmployeeService) { }

  ngOnInit(): void {
    this.configsubscription = this.store.select('config').pipe(filter(config => config !== null)).subscribe(config => {
        this.smallScreen = config.smallScreen;
    });


    this.discountsService.readData().subscribe(data => {
      this.discounts = data;
      this.parseDiscounts();
    });
    this.risingsService.readData().subscribe(data => {
      this.risings = data;
      this.parseRisings();
    });

    this.employeService.readData().subscribe(data => {
      this.employees = data;
    });

    this.cellarService.readData().subscribe(data => {
      const cellars: string[] = data.map(x => x._id);
      this.employeService.getData(cellars);
    });
  }


  ngAfterContentInit(): void {
    this.discountsService.getData();
    this.risingsService.getData();
    this.cellarService.getData();
  }


  
  
  
  
  // citaIGSS





  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // OPERATIONAÑ FUNCTIONS ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  parseDiscounts() {
    this.foults = this.discounts.filter(d => d.type === 'falta');
    this.permissions = this.discounts.filter(d => d.type === 'permiso');
    this.retentions = this.discounts.filter(d => d.type === 'retención');
    this.IGSSsuspentions = this.discounts.filter(d => d.type === 'suspensiónIGSS');
    this.lows = this.discounts.filter(d => d.type === 'bajas');
    this.temporalSuspention = this.discounts.filter(d => d.type === 'suspencionTemporal');
    this.citaIGSS = this.discounts.filter(d => d.type === 'citaIGSS');
    this.alertsCalls = this.discounts.filter(d => d.type === 'llamadas');
  }

  parseRisings() {
    this.extraHours = this.risings.filter(d => d.type === 'horasExtra');
    this.holidays = this.risings.filter(d => d.type === 'asueto');
    this.comissions = this.risings.filter(d => d.type === 'comisión');
    this.bonus = this.risings.filter(d => d.type === 'bono');
    this.rising = this.risings.filter(d => d.type === 'aumentoSalario');
  }







  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // NEW DISCOUNT FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  newFault() {
    this.openDiscountDialog('Nueva falta', 'falta', 'new', 'Falta Creada exitósamente');
  }

  newPermission() {
    this.openDiscountDialog('Nuevo permiso', 'permiso', 'new', 'Permiso registrado exitósamente');
  }

  newRetention() {
    this.openDiscountDialog('Nueva retención', 'retención', 'new', 'Retención registrada exitósamente');
  }

  newIGSS() {
    this.openDiscountDialog('Nueva suspención del IGSS', 'suspensiónIGSS', 'new', 'Suspención del IGSS registrada exitósamente');
  }
  newCitaIGSS() {
    this.openDiscountDialog('Nueva cita del IGSS', 'citaIGSS', 'new', 'Cita del IGSS registrada exitósamente');
  }

  newLow() {
    this.openDiscountDialog('Nueva baja', 'bajas', 'new', 'Baja registrada exitósamente');
  }

  newTemporal() {
    this.openDiscountDialog('Nueva suspención temporal', 'suspencionTemporal', 'new', 'Suspención temporal registrada exitósamente');
  }

  newCall() {
    this.openDiscountDialog('Nueva llamada de atención', 'llamadas', 'new', 'Llamada de atención registrada exitósamente');
  }


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // EDIT DISCOUNT FUNCTIONS /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  editFault(d: DiscountItem) {
    this.openDiscountDialog('Editar falta', 'falta', 'edit', 'Falta modificada exitósamente', d);
  }

  editPermission(d: DiscountItem) {
    this.openDiscountDialog('Editar permiso', 'permiso', 'edit', 'Permiso modificado exitósamente', d);
  }

  editRetention(d: DiscountItem) {
    this.openDiscountDialog('Editar retención', 'retención', 'edit', 'Retención modificada exitósamente', d);
  }

  editIGSS(d: DiscountItem) {
    this.openDiscountDialog('Editar suspención del IGSS', 'suspensiónIGSS', 'edit', 'Suspención del IGSS modificada exitósamente', d);
  }

  editCitaIgss(d: DiscountItem) {
    this.openDiscountDialog('Editar cita del IGSS', 'citaIGSS', 'edit', 'Cita del IGSS modificada exitósamente', d);
  }

  editLow(d: DiscountItem) {
    this.openDiscountDialog('Editar baja', 'bajas', 'edit', 'Baja modificada exitósamente', d);
  }

  editTemporal(d: DiscountItem) {
    this.openDiscountDialog('Editar suspención temporal', 'suspencionTemporal', 'edit', 'Suspención temporal modificada exitósamente', d);
  }

  editCall(d: DiscountItem) {
    this.openDiscountDialog('Editar llamada de atención', 'llamadas', 'edit', 'Llamada de atención modificada exitósamente', d);
  }


  openDiscountDialog(title: string, type: string, role: string, success: string, discount?: DiscountItem) {
    let data;
    if (discount) {
      data = { title: title, type: type, role: role, success: success, discount: discount };
    } else {
      data = { title: title, type: type, role: role, success: success };
    }


    const dialogRef = this.dialog.open(NewDiscountComponent, {
      width: this.smallScreen ? '100%' : '550px',
      disableClose: true,
      data: {...data, employees: this.employees},
      panelClass: ['farmacia-dialog', 'farmacia'],
    });


    dialogRef.afterClosed().subscribe(data => {
      if (data === true) {
        this.discountsService.loadData();
      }
    });
  }









  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // NEW RISING FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  newExtraHour() {
    this.openRisingDialog('Nueva Hora Extra', 'horasExtra', 'new', 'Hora extra registrada exitósamente');
  }

  newHoliday() {
    this.openRisingDialog('Nueva día de asueto', 'asueto', 'new', 'Día registrado exitósamente');
  }

  newComission() {
    this.openRisingDialog('Nueva Comsisión', 'comisión', 'new', 'Comisión registrada exitósamente');
  }

  newBonus() {
    this.openRisingDialog('Nuevo Bono', 'bono', 'new', 'Bono registrado exitósamente');
  }

  newRisning() {
    this.openRisingDialog('Nuevo aumento de salario', 'aumentoSalario', 'new', 'Aumento registrado exitósamente');
  }



  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // EDIT RISING FUNCTIONS ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  editExtraHour(r: RisingItem) {
    this.openRisingDialog('Editar Hora Extra', 'horasExtra', 'edit', 'Hora extra modificada exitósamente', r);
  }

  editHoliday(r: RisingItem) {
    this.openRisingDialog('Editar asueto', 'asueto', 'edit', 'Hora extra modificada exitósamente', r);
  }

  editComission(r: RisingItem) {
    this.openRisingDialog('Editar Comsisión', 'comisión', 'edit', 'Comisión modificada exitósamente', r);
  }

  editBonus(r: RisingItem) {
    this.openRisingDialog('Editar Bono', 'bono', 'edit', 'Bono modificado exitósamente', r);
  }

  editRisning(r: RisingItem) {
    this.openRisingDialog('Editar aumento de salario', 'aumentoSalario', 'edit', 'Aumento modificado exitósamente', r);
  }


  openRisingDialog(title: string, type: string, role: string, success: string, rising?: RisingItem) {
    let data;
    if (rising) {
      data = { title: title, type: type, role: role, success: success, rising: rising };
    } else {
      data = { title: title, type: type, role: role, success: success };
    }


    const dialogRef = this.dialog.open(NewRisingComponent, {
      width: this.smallScreen ? '100%' : '550px',
      disableClose: true,
      data: {...data, employees: this.employees},
      panelClass: ['farmacia-dialog', 'farmacia'],
    });


    dialogRef.afterClosed().subscribe(data => {
      if (data === true) {
        this.risingsService.loadData();
      }
    });
  }

}
