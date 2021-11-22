import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InternalOrderItemFull } from 'src/app/core/models/InternalOrder';
import { ProductAddedItem } from 'src/app/core/models/Product';
import { InternalOrderService } from 'src/app/core/services/httpServices/internal-order.service';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';
import { ConfirmationDialogComponent } from 'src/app/pages/shared-components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-dispatch-form',
  templateUrl: './dispatch-form.component.html',
  styleUrls: ['./dispatch-form.component.scss']
})
export class DispatchFormComponent implements OnInit {
  @Input() smallScreen: boolean;
  @Input() ORDER: InternalOrderItemFull;
  @Output() saving = new EventEmitter<any>()

  dispatchProducts: ProductAddedItem[] = [];
  constructor(public dialog: MatDialog, public internalOrderService: InternalOrderService, public toasty: ToastyService) { }

  ngOnInit(): void {
    console.log(this.ORDER);
  }




  add(p: ProductAddedItem) {
    const exists = this.ORDER.detail.findIndex(pr => pr._product._id === p._product._id);
    if (exists > -1) {}  else {
      this.dispatchProducts.push({...p});
    }
  }
  remove(p: ProductAddedItem) {
    const exists = this.dispatchProducts.findIndex(pr => pr._product._id === p._product._id);
    if (exists > -1) {
      this.dispatchProducts.splice(exists, 1);
    }
  }


  dispatch() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { title: 'Despachar Pedido', message: '¿Confirma que desea despachar el pedido  ' + this.ORDER.noOrder + '?' },
      disableClose: true,
      panelClass: ['farmacia-dialog', 'farmacia'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.ORDER.state = 'DESPACHO';
        this.ORDER.detail = [...this.dispatchProducts];
        this.internalOrderService.updateInternalOrderState(this.ORDER).subscribe(data => {
          this.toasty.success('Pedido despachado exitosamente');
          this.saving.emit(true);

        }, error => {
          this.toasty.error('Error al despachar el pedido');
        });
      }
    });
  }

}
