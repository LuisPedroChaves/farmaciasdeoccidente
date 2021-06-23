import { Component, OnInit, AfterContentInit, OnDestroy, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CellarItem } from 'src/app/core/models/Cellar';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { InternalOrderService } from '../../../../../core/services/httpServices/internal-order.service';
import { CellarService } from '../../../../../core/services/httpServices/cellar.service';
import { InternalOrderItem } from '../../../../../core/models/InternalOrder';
import { UploadFileService } from 'src/app/core/services/httpServices/upload-file.service';

@Component({
  selector: 'app-new-internal-oorder',
  templateUrl: './new-internal-oorder.component.html',
  styleUrls: ['./new-internal-oorder.component.scss']
})
export class NewInternalOorderComponent implements OnInit, AfterContentInit, OnDestroy {

  loading = false;

  form = new FormGroup({
    _cellar: new FormControl(null),
    _destination: new FormControl(null, [Validators.required]),
    noOrder: new FormControl(null, [Validators.required]),
    details: new FormControl(null),
    file: new FormControl(null),
    type: new FormControl('PEDIDO',),
    state: new FormControl('CONFIRMACION',),
  });

  // Sucursales tipo bodega
  cellarsSubscription: Subscription;
  cellars: CellarItem[];

  constructor(
    public dialogRef: MatDialogRef<NewInternalOorderComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public internalOrderService: InternalOrderService,
    public toasty: ToastyService,
    public cellarService: CellarService,
    public uploadFileService: UploadFileService
  ) { }

  ngOnInit(): void {
    this.cellarsSubscription = this.cellarService.readData().subscribe(data => {
      this.cellars = data.filter(cellar => cellar.type === 'BODEGA');
    });
  }

  ngAfterContentInit() {
    this.cellarService.loadData();
  }

  ngOnDestroy() {
    this.cellarsSubscription?.unsubscribe();
  }

  saveInternalOrder() {
    if (this.form.invalid) { return; }
    this.loading = true;
    this.form.get('_cellar').setValue(this.data.currentCellar);
    let internalOrder: InternalOrderItem = { ...this.form.value };
    const FILE: any = internalOrder.file;
    if (FILE) {
      internalOrder.file = 'archivo.temp';
    }else {
      internalOrder.file = null;
    }
    this.internalOrderService.createInternalOrder(internalOrder).subscribe(data => {
      if (data.ok === true) {
        if (FILE) {
          this.uploadFileService.uploadFile(FILE.files[0], 'internalOrders', data.internalOrder._id)
            .then((resp: any) => {
              this.toasty.success('Pedido creado exitosamente');
              this.dialogRef.close('ok');
              this.loading = false;
            })
            .catch(err => {
              this.loading = false;
              this.toasty.error('Error al cargar el archivo');
            });
        } else {
          this.toasty.success('Pedido creado exitosamente');
          this.dialogRef.close('ok');
          this.loading = false;
        }
      } else {
        this.loading = false;
        this.toasty.error('Error al crear el pedido');
      }
    }, err => {
      this.loading = false;
      this.toasty.error('Error al crear el pedido');
    });
  }

}
