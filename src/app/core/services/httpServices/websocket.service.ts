import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { CellarItem } from '../../models/Cellar';
import { UserItem } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;
  public user: UserItem;

  constructor(private socket: Socket) {
    this.checkStatus();
  }

  // función para determinar el estado del socket
  checkStatus() {
    this.socket.on('connect', () => {
      console.log('Cliente conectado al servidor');
      this.socketStatus = true;
    });
    this.socket.on('disconnect', () => {
      console.log('Cliente desconectado del servidor');
      this.socketStatus = false;
    });
  }

  // función para emitir cualquier evento
  emit(event: string, payload?: any, callback?: Function) {
    console.log('Emitiendo...', payload);
    this.socket.emit(event, payload, callback);
  }

  // función para escuchar cualquier evento
  listen(event: string) {
    return this.socket.fromEvent(event);
  }

  // función para identificar a una sucursal conectado al servidor
  loginCellar(cellar: CellarItem) {
    return new Promise((resolve, reject) => {
      cellar.sala = true;
      this.emit('cellarConfig', cellar, (resp) => {
        resolve(true);
      });
    });
  }

  // funcion para desconectar a una sucursal de los sockets
  logoutCellar(cellar: CellarItem) {
    cellar.sala = false;
    return new Promise((resolve, reject) => {
      this.emit('cellarConfig', cellar, (resp) => {
        resolve(true);
      });
    });
  }
}
