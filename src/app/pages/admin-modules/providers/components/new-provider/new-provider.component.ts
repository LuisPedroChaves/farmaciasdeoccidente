import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
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
    nit: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required]),
    creditDays: new FormControl(null, [Validators.required]),
  });

  loading = false;

  constructor(
    public toasty: ToastyService,
    public router: Router,
    public dialogRef: MatDialogRef<NewProviderComponent>
  ) {}

  ngOnInit(): void {}

  saveProduct(): void {
    // if (this.form.invalid) {
    //   return;
    // }
    // this.loading = true;
    // const product: ProductItem = { ...this.form.value };
    // product._brand = { name: this.form.value._brand };
    // product.substances = this.substances;
    // product.symptoms = this.symptoms;
    // this.productService.createProduct(product).subscribe(
    //   (res) => {
    //     if (res.ok) {
    //       this.form.reset();
    //       this.symptoms = [];
    //       this.substances = [];
    //       this.refreshForms();
    //       this.toasty.success('Producto Creado Exitosamente');
    //       this.loading = false;
    //       if (this.isMatDialog) {
    //         this.dialogRef.close('ok');
    //       }
    //       this.barcode.nativeElement.focus();
    //       this.defaultPresentations();
    //     } else {
    //       this.loading = false;
    //       this.toasty.error('Error al crear producto');
    //     }
    //   },
    //   (error) => {
    //     this.loading = false;
    //     this.toasty.error('Error al crear producto');
    //   }
    // );
  }
}
