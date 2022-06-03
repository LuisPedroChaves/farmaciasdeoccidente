import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { BankStore } from 'src/app/store/reducers/bank.reducer';
import { CLOSE_DRAWER } from 'src/app/store/actions';
import { BankService } from 'src/app/core/services/httpServices/bank.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { BankItem } from '../../../../../core/models/Bank';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';
import { UploadFileService } from 'src/app/core/services/httpServices/upload-file.service';
import { FileInput } from 'ngx-material-file-input';

@Component({
  selector: 'app-new-bank',
  templateUrl: './new-bank.component.html',
  styleUrls: ['./new-bank.component.scss']
})
export class NewBankComponent implements OnInit, AfterContentInit, OnDestroy {

  title: string;

  form = new FormGroup({
    image: new FormControl(''),
    name: new FormControl('', Validators.required),
  })

  bankStoreSubscription = new Subscription;
  bankSubscription: Subscription;
  banks: BankItem[];

  sessionSubscription: Subscription;
  permissions: string[] = [];

  constructor(
    private store: Store<BankStore>,
    private bankService: BankService,
    private toastyService: ToastyService,
    private dialog: MatDialog,
    private uploadFileService: UploadFileService,
  ) { }

  ngOnInit(): void {

    this.sessionSubscription = this.store.select('session').pipe(filter(session => session !== null)).subscribe(session => {
      if (session.permissions !== null) {
        const MODULOS = session.permissions.filter(pr => pr.name === 'accountsPyabaleChecks');
        this.permissions = MODULOS.length > 0 ? MODULOS[0].options : [];
      }
    });

    this.bankStoreSubscription = this.store.select('Bank')
      .subscribe(state => {
        this.title = state.drawerTitle;
      });

    this.bankSubscription = this.bankService.readData().subscribe((data) => {
      this.banks = data;
    });

  }


  ngAfterContentInit(): void {
    this.bankService.loadData();
  }

  ngOnDestroy(): void {
    this.sessionSubscription?.unsubscribe();
    this.bankStoreSubscription?.unsubscribe();
    this.bankSubscription?.unsubscribe();
  }

  close() {
    this.store.dispatch(CLOSE_DRAWER());
  }

  save() {
    // Manejo de archivo
    const FILE: FileInput = this.form.controls.image.value;
    if (FILE) {
      this.form.controls.image.setValue('archivo.temp');
    } else {
      this.form.controls.image.setValue(null);
    }

    this.bankService.create({ ...this.form.value })
      .subscribe(resp => {
        // Manejo de archivo
        if (FILE) {
          if (FILE.files) {
            this.uploadFileService.uploadFile(FILE.files[0], 'banks', resp.bank._id)
              .then((resp: any) => {
                this.saveSuccess();
              })
              .catch(err => {
                this.toastyService.error('Error al cargar el archivo');
              });
          } else {
            this.saveSuccess();
          }
        } else {
          this.saveSuccess();
        }
      })
  }

  saveSuccess(): void {
    this.toastyService.success('Banco creado exitosamente')
    this.bankService.loadData();
    this.form.reset();
  }

  delete(bank: BankItem) {
    /* #region  Validaciones */
    if (!this.permissions.includes('delete')) {
      this.toastyService.error('Acceso Denegado', 'Actualmente no cuenta con permisos para realizar para realizar esta acción');
      return
    }
    /* #endregion */

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Eliminar Banco', message: '¿Confirma que desea anular el banco ' + bank.name + '?', description: true },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {

        this.bankService.delete(bank, result)
          .subscribe(resp => {
            this.toastyService.success('Banco eliminado exitosamente');
            this.bankService.loadData();
          })
      }
    });
  }

}
