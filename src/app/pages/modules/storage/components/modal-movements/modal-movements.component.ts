import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LoteDetailsComponent } from '../lote-details/lote-details.component';

@Component({
  selector: 'app-modal-movements',
  templateUrl: './modal-movements.component.html',
  styleUrls: ['./modal-movements.component.scss'],
})
export class ModalMovementsComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ModalMovementsComponent>) {}

  ngOnInit(): void {}
}
