import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-statistics',
  templateUrl: './modal-statistics.component.html',
  styleUrls: ['./modal-statistics.component.scss']
})
export class ModalStatisticsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalStatisticsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

}
