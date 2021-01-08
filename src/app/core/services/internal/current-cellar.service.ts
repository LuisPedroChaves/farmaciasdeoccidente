import { Injectable } from '@angular/core';
import { IDataService } from '../config/i-data-service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentCellarService implements IDataService<any> {
  private currentCellar: any;
  currentCellarSubject = new Subject<any>();

  constructor() { }

  loadData() {
    this.currentCellarSubject.next(this.currentCellar);
  }

  getData() {
    this.currentCellarSubject.next(this.currentCellar);
  }

  readData(): Observable<any> {
    return this.currentCellarSubject.asObservable();
  }

  setData(e: any) {
    this.currentCellar = e;
    this.currentCellarSubject.next(this.currentCellar);
  }

  invalidateData() {
    if (this.currentCellar === undefined) {
      // do nothing creo
    } else {
      delete this.currentCellar;
      this.currentCellarSubject.next(undefined);
    }
  }

}
