import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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

/* FLEX ----------------------*/
import { FlexLayoutModule, CoreModule } from '@angular/flex-layout';
import { NewCellarComponent } from './new-cellar/new-cellar.component';


@NgModule({
  declarations: [NewCellarComponent],
  imports: [
    CommonModule,

    // visibilty
    FlexLayoutModule,
    CoreModule,

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
  ],
  exports: [
    // visibilty
    FlexLayoutModule,
    CoreModule,

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

  ]
})
export class SharedComponentsModule { }
