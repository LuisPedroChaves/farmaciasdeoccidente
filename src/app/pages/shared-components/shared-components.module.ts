import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* MATERIAL ---------------------------------- */
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';

/* FLEX ----------------------*/
import { FlexLayoutModule, CoreModule } from '@angular/flex-layout';
import { NewCellarComponent } from './new-cellar/new-cellar.component';


/* STYLE ----------------------*/
import { ToastaModule } from 'ngx-toasta';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MatTableResponsiveModule } from '../modules/mat-table-responsive/mat-table-responsive.module';

@NgModule({
  declarations: [NewCellarComponent, ConfirmationDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // visibilty
    FlexLayoutModule,
    CoreModule,
    ToastaModule.forRoot(),

    // material
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatCheckboxModule,
    MatDialogModule,
    MatRadioModule,
    MatTabsModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatBottomSheetModule,
    MatTableResponsiveModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    // visibilty
    FlexLayoutModule,
    CoreModule,
    ToastaModule,

    // material
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatCheckboxModule,
    MatDialogModule,
    MatRadioModule,
    MatTabsModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatBottomSheetModule,
    MatTableResponsiveModule
  ]
  ,providers: [
    {provide: MAT_DATE_LOCALE, useValue:'es-GT'}
  ]
})
export class SharedComponentsModule { }
