import { Injectable } from '@angular/core';
import { IDataService } from '../config/i-data-service';
import { ControlEvent } from '../../models/ControlEvent';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventBusService implements IDataService<ControlEvent>  {
  private event: ControlEvent;
  eventSubject = new Subject<ControlEvent>();
  constructor() { }

  loadData() {
    this.eventSubject.next(this.event);
  }

  getData() {
    this.eventSubject.next(this.event);
  }

  readData(): Observable<ControlEvent> {
    return this.eventSubject.asObservable();
  }

  setData(e: ControlEvent) {
    this.event = e;
    this.eventSubject.next(this.event);
  }

  invalidateData() {}

  emitEvent(event: string, payload?: any) {
    const e: ControlEvent = new ControlEvent();
    e.Event = event;
    e.Payload = payload;
    this.setData(e);
  }
}
