import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-cellar',
  templateUrl: './new-cellar.component.html',
  styleUrls: ['./new-cellar.component.scss']
})
export class NewCellarComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NewCellarComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

  }

}
