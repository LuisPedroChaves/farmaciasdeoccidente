import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;

  constructor(private socket: Socket) {
    this.checkStatus();
  }

  checkStatus() {
    console.log(this.socket.connect());
      this.socket.on('connect', () => {
        console.log('Cliente conectado al servidor');
        this.socketStatus = true;
      });
      this.socket.on('disconnect', () => {
        console.log('Cliente desconectado del servidor');
        this.socketStatus = false;
      });
  }
}
