import { Component, OnDestroy, OnInit } from '@angular/core';
import {MediaObserver} from '@angular/flex-layout';
import { Store } from '@ngrx/store';
import { Subscription} from 'rxjs';
import { AppState } from './core/store/app.reducer';
import * as actions from './core/store/actions';
import { WebsocketService } from './core/services/httpServices/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'farmaciasdeoccidente';
  constructor(
    public websocketS: WebsocketService,
    public mediaObserver: MediaObserver,
    private store: Store<AppState>,){
    if (localStorage.getItem('farmaciasDO-session') !== null) {
      const session = JSON.parse(localStorage.getItem('farmaciasDO-session'));
      this.store.dispatch(actions.loginSuccess({session}));
    }
  }
  ngOnInit(): void{

  }
  ngOnDestroy(): void{

}
}
