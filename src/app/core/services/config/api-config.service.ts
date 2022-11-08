import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiConfigService {
  constructor() {}

  // Url base
  public API_URL = environment.root;

  /* #region  AUTH */
  public API_LOGIN = this.API_URL + '/login';
  public API_LOGOUT = this.API_URL + '/logout';
  public API_MENU = '/assets/data/modules-menu.json'; // ---------- no modificar

  /* #endregion */

  /* #region  ADMIN */
  // Cellar
  public API_CELLAR = this.API_URL + '/cellar';

  // Role
  public API_ROLES = '/assets/data/modules.json'; // ---------- no modificar
  public API_ROLE = this.API_URL + '/role';
  public API_MY_ROLE = this.API_URL + '/role/';

  // User
  public API_USER = this.API_URL + '/user';
  /* #endregion */

  /* #region  SUCURSALES */
  // Customer
  public API_CUSTOMER = this.API_URL + '/customer';

  // Order
  public API_ORDER = this.API_URL + '/order';
  public API_ROUTE = this.API_URL + '/route';

  // Sales
  public API_SALE = this.API_URL + '/sale';

  // Internal Orders
  public API_INTERNAL_ORDER = this.API_URL + '/internalOrder';

  // Upload Files
  public API_UPLOAD = this.API_URL + '/upload';
  public API_READ = this.API_URL + '/readFIle';

  // Employees
  public API_JOBS = this.API_URL + '/job';
  public API_DEPARTMENT = this.API_URL + '/jobDepartment';
  public API_EMPLOYEES = this.API_URL + '/employee';
  public API_EMPLOYEE_USER = this.API_URL + '/employee/user';
  public API_EMPLOYEES_JOBS = this.API_URL + '/employeeJob';
  public API_COUNTRY = 'assets/data/guatemala.json';
  public API_DISCOUNTS = this.API_URL + '/discount';
  public API_RISINGS = this.API_URL + '/rising';

  //payroll
  public API_PAYROLL = this.API_URL + '/payroll';
  public API_PAYROLL_NEW = this.API_URL + '/payroll/details';

  // Product
  public API_PRODUCT = this.API_URL + '/product';

  // Brand
  public API_BRAND = this.API_URL + '/brand';

  // Brand
  public API_PROVIDER = this.API_URL + '/provider';
  // Symptom
  public API_SYMPTOM = this.API_URL + '/symptoms';

  // Substance
  public API_SUBSTANCE = this.API_URL + '/substance';

  // Purchase
  public API_PURCHASE = this.API_URL + '/purchase';

  // tempStorage
  public API_TEMP_STORAGE = this.API_URL + '/tempStorage';

  // tempSale
  public API_TEMP_SALE = this.API_URL + '/tempSale';

  // Report Best and Worst Sellers
  public API_BEST_SELLERS = this.API_URL + '/tempSale/bestSellers';
  public API_WORST_SELLERS = this.API_URL + '/tempSale/worstSellers';

  // AutoStatistic
  public API_AUTO_STATISTIC = this.API_URL + '/autoStatistic';

  // accountsPayable
  public API_ACCOUNTS_PAYABLE = this.API_URL + '/accountsPayable';

  // expense
  public API_EXPENSE = this.API_URL + '/expense';

  // check
  public API_CHECK = this.API_URL + '/check';

  // cash
  public API_CASH = this.API_URL + '/cash';

  // cashFlow
  public API_CASH_FLOW = this.API_URL + '/cashFlow';

  // cashRequisition
  public API_CASH_REQUISITION = this.API_URL + '/cashRequisition';

  // bank
  public API_BANK = `${this.API_URL}/bank`
  // bankAccount
  public API_BANK_ACCOUNT = `${this.API_URL}/bankAccount`
  // bankFlow
  public API_BANK_FLOW = `${this.API_URL}/bankFlow`

  /* #endregion */
}
