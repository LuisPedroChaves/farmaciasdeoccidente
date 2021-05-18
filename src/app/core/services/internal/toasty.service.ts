import { Injectable } from '@angular/core';
import { ToastaConfig, ToastaService, ToastOptions } from 'ngx-toasta';

@Injectable({
  providedIn: 'root'
})
export class ToastyService {

  constructor(private toastaService: ToastaService, private toastaConfig: ToastaConfig) {
    this.toastaConfig.theme = 'default';
    this.toastaConfig.position  = 'top-center';
    this.toastaConfig.showDuration = false;
  }

  toasty(type: string, title: string, message?: string, theme?: string) {
    const toastOptions: ToastOptions = {
      title: title ? title : '',
      msg: message,
      showClose: true,
      timeout: 3000,
      theme: 'default',
    };

    switch (type) {
      case 'default': this.toastaService.default(toastOptions); break;
      case 'info': this.toastaService.info(toastOptions); break;
      case 'success': this.toastaService.success(toastOptions); break;
      case 'wait': this.toastaService.wait(toastOptions); break;
      case 'error': this.toastaService.error(toastOptions); break;
      case 'warning': this.toastaService.warning(toastOptions); break;
    }
  }

  success(title: string, message?: string) {
    const t = title ? title : '';
    const m = message ? message : '';
    const toastOptions: ToastOptions = {
      title: t,
      msg: m,
      showClose: true,
      timeout: 4000,
      theme: 'default',
    };

    this.toastaService.success(toastOptions);
  }


  error(title: string, message?: string) {
    const t = title ? title : '';
    const m = message ? message : '';
    const toastOptions: ToastOptions = {
      title: t,
      msg: m,
      showClose: true,
      timeout: 4000,
      theme: 'default',
    };

    this.toastaService.error(toastOptions);
  }

  errorServer(title: string, message?: string) {
    const t = title ? title : '';
    const m = message ? message : '';
    const toastOptions: ToastOptions = {
      title: t,
      msg: m,
      showClose: true,
      timeout: 6000,
      theme: 'default',
    };

    this.toastaService.error(toastOptions);
  }
}
