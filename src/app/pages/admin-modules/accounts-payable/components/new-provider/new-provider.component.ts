import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ProviderService } from 'src/app/core/services/httpServices/provider.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { ProviderItem } from '../../../../../core/models/Provider';

@Component({
  selector: 'app-new-provider',
  templateUrl: './new-provider.component.html',
  styleUrls: ['./new-provider.component.scss']
})
export class NewProviderComponent implements OnInit {

  @Input() isExpenses = false;
  @Output() send = new EventEmitter();

  loading = false;

  form = new FormGroup({
    nit: new FormControl(null, [Validators.required]),
    name: new FormControl(null, [Validators.required]),
    checkName: new FormControl(null, [Validators.required]),
    address: new FormControl(null, [Validators.required]),
    phone: new FormControl(null),
    email: new FormControl(null),
    creditDays: new FormControl('0', [Validators.required]),
    credit: new FormControl('0', [Validators.required]),
    iva: new FormControl(false),
    isr: new FormControl(false),
    isExpenses: new FormControl(false),
  });

  formIsExpenses = new FormGroup({
    nit: new FormControl(null, [Validators.required]),
    name: new FormControl(null, [Validators.required]),
    address: new FormControl(null, [Validators.required]),
    phone: new FormControl(null),
    isExpenses: new FormControl(true),
  });

  constructor(
    private providerService: ProviderService,
    private toastyService: ToastyService
  ) { }

  ngOnInit(): void {
  }

  save(): void {
    this.loading = true;
    let newProvider: ProviderItem = { ...this.form.value };
    if (this.isExpenses) {
      newProvider = { ...this.formIsExpenses.value  }
    }
    console.log(newProvider);

    this.providerService.createProvider(newProvider)
      .subscribe(resp => {
        this.toastyService.success('Proveedor creado exitosamente')
        this.form.reset({
          nit: '',
          name: '',
          checkName: '',
          address: '',
          phone: '',
          email: '',
          creditDays: 0,
          credit: 0,
          iva: false,
          isr: false,
          isExpenses: false
        })
        this.send.emit(resp.provider);
      })
  }

}
