import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfigService } from '../config/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class JobsService {


  public jobList: any[];
  jobsSubject = new Subject<any[]>();

  constructor(public http: HttpClient, public apiConfigService: ApiConfigService) { }

  readData(): Observable<any> {
    return this.jobsSubject.asObservable();
  }

  getJobs() {
    if ( this.jobList === undefined ) {
      this.loadJobs();
    } else {
      this.jobsSubject.next( this.jobList );
    }
  }


  loadJobs() {
    this.http.get(this.apiConfigService.API_JOBS).pipe(map((response: any) => {
      this.jobList = response.orders;
      this.jobsSubject.next( this.jobList);
    }));
  }

  loadDepartments():  Observable<any> {
    return this.http.get(this.apiConfigService.API_DEPARTMENT);
  }
}
