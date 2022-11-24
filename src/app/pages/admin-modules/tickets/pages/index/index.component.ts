import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductItem } from '../../../../../core/models/Product';
import { ProductService } from '../../../../../core/services/httpServices/product.service';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { TempStorageService } from '../../../../../core/services/httpServices/temp-storage.service';
import { ProviderItem } from '../../../../../core/models/Provider';
import { SafeUrl } from '@angular/platform-browser';
import { TicketService } from '../../../../../core/services/httpServices/ticket.service';
import { ITicket } from '../../../../../core/models/ticket';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  wsize = 200;

  isLoading = false;
  loading = false;
  displayQR = false;

  selectedProvider: ProviderItem;
  qrCodeDownloadLink: any = '';

  nameProduct = '';
  codeProduct = '';
  lote = '';
  expiredDate: Date;


  @ViewChild('searchCode') searchCode: ElementRef<HTMLInputElement>;
  filteredProducts: ProductItem[];

  productForm = new FormGroup({
    searchCode: new FormControl(null, Validators.required),
    lote: new FormControl(null, Validators.required),
    expiredDate: new FormControl(null, Validators.required),
  });

  selectedProduct: any = {
    description: '',
    _brand: {
      name: ''
    }
  };

  currentFile: any;

  constructor(
    public productService: ProductService,
    public tempStorageService: TempStorageService,
    private ticketService: TicketService,
    private dialog: MatDialog,
    private toastyService: ToastyService
  ) { }

  ngOnInit(): void {

    this.productForm.get('searchCode').valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.filteredProducts = [];
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.productService.searchCheckStock(value, 'barcode').pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((data) => {
        this.filteredProducts = data['products'];
      });

    setTimeout(() => {
      this.searchCode.nativeElement.focus();
    }, 500);
  }

  getShowDescription(product: ProductItem): string {
    return product ? product.description : '';
  }

  searchStock(product: ProductItem): void {
    // console.log("🚀 ~ file: check-stock.component.ts ~ line 95 ~ CheckStockComponent ~ searchStock ~ product", product)
    this.loading = true;
    this.selectedProduct = product;
    if (product) {
      const { barcode, description } = product;
      this.nameProduct = description;
      this.codeProduct = barcode;

      if (product.ticket) {
        console.log(product.ticket);

        this.selectedProvider = { ...this.selectedProvider, code: product.ticket.providerCode },
        this.lote = product.ticket.loteCode
        this.expiredDate = product.ticket.date

        this.displayQR = true;

      } else {
        this.displayQR = false
      }
    }
  }

  getProvider(provider: ProviderItem): void {
    this.selectedProvider = provider;
    console.log(this.selectedProvider);
  }

  onChangeURL(url: SafeUrl): void {
    console.log(url);
    this.qrCodeDownloadLink = url;
  }

  showQR(): void {
    if (this.productForm.valid) {
      const { lote, expiredDate } = this.productForm.value;
      this.lote = lote;
      this.expiredDate = expiredDate;
      this.displayQR = true;
    }
  }

  async printQR(parent): Promise<void> {

    // Esta funcion devuelve el QR en base64
    const parentElement = parent.qrcElement.nativeElement.querySelector('canvas');
    const generatedImage = parentElement.toDataURL('image/png');
    const ticket: ITicket = {
      providerCode: this.selectedProvider.code,
      productCode: this.codeProduct,
      productName: this.nameProduct,
      lote: this.lote,
      expiredDate: this.expiredDate,
      qr64: generatedImage
    };

    this.ticketService.print(ticket, 1);
  }

  loadStorage(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Cargar TICKETS',
        message:
          '¿Confirma que desea ingresar el archivo de tickets?'
      },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.loading = true;
        if (this.currentFile) {
          this.productService.uploadFileTickets(this.currentFile.files[0])
            .then((resp: any) => {
              this.loading = false;
              this.toastyService.success('Archivo subido, el archivo se actualizará en segundo plano');
            })
            .catch(err => {
              this.loading = false;
              this.toastyService.error('Error al cargar el archivo');
            });
        } else {
          this.loading = false;
          this.toastyService.error('Debe seleccionar un archivo');
          return;
        }
      }
    });
  }

}
