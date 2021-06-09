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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';

/* FLEX ----------------------*/
import { FlexLayoutModule, CoreModule } from '@angular/flex-layout';


/* STYLE ----------------------*/
import { ToastaModule } from 'ngx-toasta';
import { MatTableResponsiveModule } from '../modules/mat-table-responsive/mat-table-responsive.module';

/* FILE ----------------------*/
import { MaterialFileInputModule } from 'ngx-material-file-input';

/* COMPONENTS ----------------------*/
import { NewCellarComponent } from './new-cellar/new-cellar.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UpdateNotificationsComponent } from './update-notifications/update-notifications.component';
@NgModule({
  declarations: [NewCellarComponent, ConfirmationDialogComponent, NotificationsComponent, UpdateNotificationsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // visibilty
    FlexLayoutModule,
    CoreModule,
    ToastaModule.forRoot(),

    // files
    MaterialFileInputModule,

    // material
    MatBadgeModule,
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
    MatTableResponsiveModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatRippleModule,
    MatTooltipModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,

    // visibilty
    FlexLayoutModule,
    CoreModule,
    ToastaModule,

    // files
    MaterialFileInputModule,

    // material
    MatBadgeModule,
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
    MatTableResponsiveModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatRippleModule,
    MatTooltipModule,

    // components
    NewCellarComponent,
    ConfirmationDialogComponent,
    NotificationsComponent
  ]
  , providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es' }
  ]
})
export class SharedComponentsModule { }
