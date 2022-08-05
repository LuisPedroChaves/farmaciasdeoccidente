import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import {
  DateAdapter,
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

/* FLEX ----------------------*/
import { FlexLayoutModule, CoreModule } from '@angular/flex-layout';

/* STYLE ----------------------*/
import { ToastaModule } from 'ngx-toasta';
import { MatTableResponsiveModule } from '../modules/mat-table-responsive/mat-table-responsive.module';
import { SimplebarAngularModule } from 'simplebar-angular';

/* FILE ----------------------*/
import { MaterialFileInputModule } from 'ngx-material-file-input';

/* COMPONENTS ----------------------*/
import { NewCellarComponent } from './new-cellar/new-cellar.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UpdateNotificationsComponent } from './update-notifications/update-notifications.component';
import { getSpanishPaginatorIntl } from './spanish-paginator-intl';
import { LoaderComponent } from './loader/loader.component';
import { UserComponent } from './user/user.component';


import {
  MatMomentDateModule,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import 'moment/locale/es';
import { ConfirmationComponent } from './confirmation/confirmation.component';
// Tambien hay que instalar MOMENT JS
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@NgModule({
  declarations: [
    NewCellarComponent,
    ConfirmationDialogComponent,
    NotificationsComponent,
    UpdateNotificationsComponent,
    LoaderComponent,
    UserComponent,
    ConfirmationComponent,
  ],
  imports: [
    MatDividerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    
    // visibilty
    FlexLayoutModule,
    CoreModule,
    ToastaModule.forRoot(),
    SimplebarAngularModule,
    
    // files
    MaterialFileInputModule,
    
    // material
    MatStepperModule,
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
    MatPaginatorModule,
    MatSortModule,
    MatStepperModule,
    MatMomentDateModule,
    MatSlideToggleModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,

    // visibilty
    FlexLayoutModule,
    CoreModule,
    ToastaModule,
    SimplebarAngularModule,

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
    MatPaginatorModule,
    MatSortModule,
    MatStepperModule,
    MatMomentDateModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatStepperModule,
    // components
    NewCellarComponent,
    ConfirmationDialogComponent,
    NotificationsComponent,
    LoaderComponent,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
    DatePipe,
  ],
})
export class SharedComponentsModule {}
