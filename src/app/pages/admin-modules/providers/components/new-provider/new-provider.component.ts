import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { ProviderItem } from 'src/app/core/models/Provider';
import { ProviderService } from 'src/app/core/services/httpServices/provider.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';

@Component({
  selector: 'app-new-provider',
  templateUrl: './new-provider.component.html',
  styleUrls: ['./new-provider.component.scss'],
})
export class NewProviderComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    address: new FormControl(null, [Validators.required]),
    nit: new FormControl(null),
    phone: new FormControl(null),
    email: new FormControl(null),
    creditDays: new FormControl('0', [Validators.required]),
    credit: new FormControl('0', [Validators.required]),
    iva: new FormControl(false),
    isr: new FormControl(true)
  });

  loading = false;

  constructor(
    public toasty: ToastyService,
    public router: Router,
    public dialogRef: MatDialogRef<NewProviderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public providerService: ProviderService
  ) {}

  ngOnInit(): void {}

  saveProduct(): void {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    const provider: ProviderItem = { ...this.form.value };
    console.log(provider);
    this.providerService.createProvider(provider).subscribe(
      (data) => {
        if (data.ok === true) {
          this.toasty.success('Proveedor creado exitosamente');
          this.dialogRef.close('ok');
          this.loading = false;
        } else {
          this.loading = false;
          this.toasty.error('Error al crear el Proveedor');
        }
      },
      (err) => {
        this.loading = false;
        this.toasty.error('Error al crear el Proveedor');
      }
    );
  }
}
