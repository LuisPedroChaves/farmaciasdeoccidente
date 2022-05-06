import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UploadFileService } from 'src/app/core/services/httpServices/upload-file.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';

@Component({
  selector: 'app-enter-payment',
  templateUrl: './enter-payment.component.html',
  styleUrls: ['./enter-payment.component.scss']
})
export class EnterPaymentComponent implements OnInit {

  noReceipt = '';

  constructor(
    public dialogRef: MatDialogRef<EnterPaymentComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private uploadFileService: UploadFileService,
    private toastyService: ToastyService
  ) { }

  ngOnInit(): void {
  }

  upload(file: File, check: any) {
    if (!file) {
      return;
    }

    this.uploadFileService.uploadFile(file, 'checkReceipts', check._id)
      .then((resp: any) => {
        this.toastyService.success('Archivo guardado exitosamente');
        check.receipt.file = resp.newNameFile;
      })
      .catch(err => {
        this.toastyService.error('Error al cargar el archivo');
      });
  }


}
