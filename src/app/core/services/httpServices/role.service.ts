import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { IDataService } from '../config/i-data-service';
import { ApiConfigService } from '../config/api-config.service';
import { PermissionItem, RoleItem } from '../../models/Role';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleService implements IDataService<RoleItem[]> {

  public roleList: RoleItem[];
  roleSubject = new Subject<RoleItem[]>();

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }

  getPermissionsList(): Observable<PermissionItem[]> {

    return this.http.get<PermissionItem[]>(this.apiConfigService.API_ROLES);
  }

  getMyRole(): Observable<any> {
    let role = '';
    if (localStorage.getItem('farmaciasDO-session') !== null) {
      role = JSON.parse(localStorage.getItem('farmaciasDO-session')).user._role;
    }
    return this.http.get<RoleItem>(this.apiConfigService.API_MY_ROLE + role);
  }

  loadData() {
    this.http.get(this.apiConfigService.API_ROLE).pipe(
        map((response: any) => {
          this.roleList = response.roles;
          this.roleSubject.next( this.roleList);
    })).subscribe();
  }

  getData() {
    if ( this.roleList === undefined ) {
      this.loadData();
    } else {
      this.roleSubject.next( this.roleList );
    }
  }

  readData(): Observable<RoleItem[]> {
    return this.roleSubject.asObservable();
  }

  setData() {}

  invalidateData() {
    if (this.roleList === undefined) {
    } else {
      delete this.roleList;
    }
  }

  createRole(u: RoleItem): Observable<any> {
    // const jsonParms = JSON.stringify(u);
    return this.http.post(this.apiConfigService.API_ROLE, u);
  }

  updateRole(u: RoleItem): Observable<any> {
    const jsonParms = JSON.stringify(u);
    return this.http.put(this.apiConfigService.API_ROLE + '/' + u._id, jsonParms);
  }

  deleteRole(u: RoleItem): Observable<any> {
    return this.http.delete(this.apiConfigService.API_ROLE + '/' + u._id);
  }
}
