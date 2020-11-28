import { Component, OnDestroy, OnInit } from '@angular/core';
import {MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription} from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'farmaciasdeoccidente';
  constructor(public mediaObserver: MediaObserver){}
  ngOnInit(): void{

  }
  ngOnDestroy(): void{ 

}
}
