import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {

  constructor() { }

  // Url base
  public API_URL = environment.root;

  /* #region  AUTH */
  public API_LOGIN = this.API_URL + '/login';

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

}
