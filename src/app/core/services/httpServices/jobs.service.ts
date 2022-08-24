import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { JobItem } from '../../models/Jobs';
import { ApiConfigService } from '../config/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class JobsService {


  public jobList: JobItem[];
  jobsSubject = new Subject<JobItem[]>();

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
      this.jobList = response.jobs;
      this.jobsSubject.next( this.jobList);
    })).subscribe();
  }

  createJob(job: JobItem): Observable<any> {
    return this.http.post(this.apiConfigService.API_JOBS, job);
  }

  updateJob(job: JobItem): Observable<any> {
    return this.http.put(`${this.apiConfigService.API_JOBS}/${job._id}`, job);
  }

  deleteJob(id: string): Observable<any> {
    return this.http.delete(`${this.apiConfigService.API_JOBS}/${id}`);
  }






  // DEPARTMENTS

  createDepartment(dep: any): Observable<any> {
    return this.http.post(this.apiConfigService.API_DEPARTMENT, dep);
  }

  updateDepartment(dep: any): Observable<any> {
    return this.http.put(`${this.apiConfigService.API_DEPARTMENT}/${dep._id}`, dep);
  }

  deleteDepartment(dep: any): Observable<any> {
    return this.http.delete(`${this.apiConfigService.API_DEPARTMENT}/${dep._id}`);
  }

  loadDepartments():  Observable<any> {
    return this.http.get(this.apiConfigService.API_DEPARTMENT);
  }
}
