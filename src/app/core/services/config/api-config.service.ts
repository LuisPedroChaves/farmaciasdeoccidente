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
  public API_MENU = 'assets/data/modules-menu.json'; // ---------- no modificar

  /* #endregion */

  /* #region  ADMIN */
  // Cellar
  public API_CELLAR = this.API_URL + '/cellar';

  // Role
  public API_ROLES = 'assets/data/modules.json'; // ---------- no modificar
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

  /* #endregion */
}
