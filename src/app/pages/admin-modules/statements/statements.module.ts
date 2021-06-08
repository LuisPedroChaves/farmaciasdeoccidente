import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatementsRoutes } from './statements.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { StatementsComponent } from './components/statements/statements.component';



@NgModule({
  declarations: [StatementsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(StatementsRoutes),
    SharedComponentsModule
  ]
})
export class StatementsModule { }
