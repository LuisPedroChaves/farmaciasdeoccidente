import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CheckItem } from 'src/app/core/models/Check';

@Component({
  selector: 'app-report-checks-documents',
  templateUrl: './report-checks-documents.component.html',
  styleUrls: ['./report-checks-documents.component.scss'],
})
export class ReportChecksDocumentsComponent {
  constructor(
    public dialogRef: MatDialogRef<ReportChecksDocumentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { check: CheckItem }
  ) {}
}
