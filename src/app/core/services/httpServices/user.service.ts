import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IDataService } from '../config/i-data-service';
import { ApiConfigService } from '../config/api-config.service';
import { UserItem } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService implements IDataService<UserItem[]>  {

  public userList: UserItem[];
  userSubject = new Subject<UserItem[]>();

  constructor(
    public http: HttpClient,
    public apiConfigService: ApiConfigService
  ) { }

  loadData() {
    this.http.get(this.apiConfigService.API_USER).pipe(
        map((response: any) => {
          this.userList = response.users;
          this.userSubject.next( this.userList);
    })).subscribe();
  }

  getData() {
    if ( this.userList === undefined ) {
      this.loadData();
    } else {
      this.userSubject.next( this.userList );
    }
  }

  readData(): Observable<UserItem[]> {
    return this.userSubject.asObservable();
  }

  setData() {}

  invalidateData() {
    if (this.userList === undefined) {
    } else {
      delete this.userList;
    }
  }

  getDeliveries(): Observable<any> {
    return this.http.get(this.apiConfigService.API_USER + '/deliveries');
  }

  getUser(id: string): Observable<any> {
    return this.http.get(this.apiConfigService.API_USER + '/user/' + id);
  }

  createUser(u: UserItem): Observable<any> {
    // const jsonParms = JSON.stringify(u);
    return this.http.post(this.apiConfigService.API_USER, u);
  }

  updateUser(u: UserItem): Observable<any> {
    // const jsonParms = JSON.stringify(u);
    return this.http.put(this.apiConfigService.API_USER + '/' + u._id, u);
  }

  deleteUser(u: UserItem): Observable<any> {
    return this.http.delete(this.apiConfigService.API_USER + '/' + u._id);
  }
}
