import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CellarItem } from 'src/app/core/models/Cellar';
import { InternalOrderItem } from 'src/app/core/models/InternalOrder';

@Component({
  selector: 'app-outgoing',
  templateUrl: './outgoing.component.html',
  styleUrls: ['./outgoing.component.scss']
})
export class OutgoingComponent implements OnInit {
  smallScreen = window.innerWidth < 960 ? true : false;
  expanded = true;
  enviados: InternalOrderItem[] = [];
  recibidos: InternalOrderItem[] = [];
  currentCellar: CellarItem;

  sessionsubscription: Subscription;
  outgoingSubscription: Subscription;
  internalOrdersp: string[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
