import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { IndexComponent } from './pages/index/index.component';
import { QuotesRoutes } from './quotes.routing';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { NewQuoteComponent } from './components/new-quote/new-quote.component';

@NgModule({
  declarations: [
    IndexComponent,
    NewQuoteComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(QuotesRoutes),
    SharedComponentsModule
  ]
})
export class QuotesModule { }
