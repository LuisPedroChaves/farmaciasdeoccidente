import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CellarItem } from 'src/app/core/models/Cellar';
import { InternalOrderItem } from 'src/app/core/models/InternalOrder';
import { InternalOrderService } from 'src/app/core/services/httpServices/internal-order.service';

@Component({
  selector: 'app-incoming-screen',
  templateUrl: './incoming-screen.component.html',
  styleUrls: ['./incoming-screen.component.scss']
})
export class IncomingScreenComponent implements OnInit {
  smallScreen = window.innerWidth < 960 ? true : false;
  loading = false;

  pendientes: InternalOrderItem[] = [];
  enProceso: InternalOrderItem[] = [];
  enRuta: InternalOrderItem[] = [];
  currentCellar: CellarItem;

  incomingSubscription: Subscription;

  constructor(public internalOrderService: InternalOrderService) { }

  ngOnInit(): void {
    this.currentCellar = JSON.parse(localStorage.getItem('currentstore'));
    this.loadInternalsOrders();

    this.incomingSubscription = this.internalOrderService.getUpdateIncoming().subscribe((internalOrder: InternalOrderItem) => {
      if (internalOrder.type === 'PEDIDO') {
        switch (internalOrder.state) {
          case 'ENVIO':
            this.pendientes.push(internalOrder);
            this.pendientes.sort((a, b) => this.getTime(new Date(a.date)) - this.getTime(new Date(b.date)));
            break;
          case 'CONFIRMACION':
            this.enProceso.push(internalOrder);
            this.pendientes = this.pendientes.filter(p => {
              return p._id !== internalOrder._id
            });
            break;
          case 'DESPACHO':
            this.enRuta.push(internalOrder);
            this.enProceso = this.enProceso.filter(p => {
              return p._id !== internalOrder._id
            });
            break;

          default:
            this.pendientes = this.pendientes.filter(p => {
              return p._id !== internalOrder._id
            });
            this.enRuta = this.enRuta.filter(e => {
              return e._id !== internalOrder._id
            });
            break;
        }
      }
    });
  }

  getTime(date?: Date) {
    return date != null ? date.getTime() : 0;
  }

  loadInternalsOrders() {
    this.loading = true;
    this.internalOrderService.getIncoming(this.currentCellar._id, 'PEDIDO').subscribe(data => {
      this.pendientes = data.internalOrders.filter(order => order.state === 'ENVIO').sort((a, b) => this.getTime(new Date(a.date)) - this.getTime(new Date(b.date)));
      this.enProceso = data.internalOrders.filter(order => order.state === 'CONFIRMACION');
      this.enRuta = data.internalOrders.filter(order => order.state === 'DESPACHO');
      this.loading = false;
    });
  }

}
