import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmployeeItem } from '../../models/Employee';
import { EmployeeJobItem } from '../../models/EmployeeJob';
import { ApiConfigService } from '../config/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  public employeeList: EmployeeItem[];
  employeeSubject = new Subject<EmployeeItem[]>();
  cellars: string[] = [];

  constructor(public http:HttpClient, public apiConfigService: ApiConfigService) { }


  loadData(cellars?: string[]) {
    if (cellars) { this.cellars = cellars; }
    this.http.get(`${this.apiConfigService.API_EMPLOYEES}?cellars=${JSON.stringify(this.cellars)}`).pipe(map((response: any) => {
      this.employeeList = response.employees;
      this.employeeSubject.next(this.employeeList);
    })).subscribe();
  }

  readData(): Observable<any> {
    return this.employeeSubject.asObservable();
  }

  getData(cellars: string[]) {
    if ( this.employeeList === undefined ) {
      this.cellars = cellars;
      this.loadData(cellars);
    } else {
      this.employeeSubject.next( this.employeeList );
    }
  }



  create(e: EmployeeItem): Observable<any> {
    return this.http.post(this.apiConfigService.API_EMPLOYEES, e);
  }

  update(e: EmployeeItem): Observable<any> {
    return this.http.put(`${this.apiConfigService.API_EMPLOYEES}/${e._id}`, e);
  }

  delete(e: EmployeeItem): Observable<any> {
    return this.http.delete(`${this.apiConfigService.API_EMPLOYEES}/${e._id}`);
  }




  getCountry(): Observable<any> {
    return this.http.get(this.apiConfigService.API_COUNTRY);
  }


  getEmployeeJobs(id: string): Observable<any> {
    return this.http.get(`${this.apiConfigService.API_EMPLOYEES_JOBS}/${id}`); 
  }

  createEmployeeJobs(job: EmployeeJobItem) {
    return this.http.post(`${this.apiConfigService.API_EMPLOYEES_JOBS}`, job); 
  }

  updateEmployeeJobs(job: EmployeeJobItem) {
    return this.http.put(`${this.apiConfigService.API_EMPLOYEES_JOBS}/${job._id}`, job); 
  }

  deleteEmployeeJobs(job: EmployeeJobItem) {
    return this.http.delete(`${this.apiConfigService.API_EMPLOYEES_JOBS}/${job._id}`); 
  }
}
