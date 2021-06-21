import { AfterContentInit, Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { CellarItem } from 'src/app/core/models/Cellar';
import { InternalOrderItem } from 'src/app/core/models/InternalOrder';
import { CellarService } from 'src/app/core/services/httpServices/cellar.service';
import { InternalOrderService } from 'src/app/core/services/httpServices/internal-order.service';
import { UploadFileService } from 'src/app/core/services/httpServices/upload-file.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss']
})
export class NewRequestComponent implements OnInit, AfterContentInit, OnDestroy {

  loading = false;

  form = new FormGroup({
    _cellar: new FormControl(null, [Validators.required]),
    _destination: new FormControl(null),
    noOrder: new FormControl(null, [Validators.required]),
    details: new FormControl(null),
    file: new FormControl(null),
    type: new FormControl('TRASLADO',),
  });

  // Sucursales tipo bodega
  cellarsSubscription: Subscription;
  cellars: CellarItem[];

  constructor(
    public dialogRef: MatDialogRef<NewRequestComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public internalOrderService: InternalOrderService,
    public toasty: ToastyService,
    public cellarService: CellarService,
    public uploadFileService: UploadFileService
  ) { }

  ngOnInit(): void {
    this.cellarsSubscription = this.cellarService.readData().subscribe(data => {
      this.cellars = data;
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
    this.form.get('_destination').setValue(this.data.currentCellar);
    let internalOrder: InternalOrderItem = { ...this.form.value };
    const FILE: any = internalOrder.file;
    internalOrder.file = null;
    this.internalOrderService.createInternalOrder(internalOrder).subscribe(data => {
      if (data.ok === true) {
        if (FILE) {
          this.uploadFileService.uploadFile(FILE.files[0], 'internalOrders', data.internalOrder._id)
            .then((resp: any) => {
              this.toasty.success('Traslado creado exitosamente');
              this.dialogRef.close('ok');
              this.loading = false;
            })
            .catch(err => {
              this.toasty.error('Error al cargar el archivo');
            });
        } else {
          this.toasty.success('Traslado creado exitosamente');
          this.dialogRef.close('ok');
          this.loading = false;
        }
      } else {
        this.loading = false;
        this.toasty.error('Error al crear el Traslado');
      }
    }, err => {
      this.loading = false;
      this.toasty.error('Error al crear el Traslado');
    });
  }

}
