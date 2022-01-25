import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { NewQuoteComponent } from './components/new-quote/new-quote.component';

export const QuotesRoutes: Routes = [
    {
    path: '',
    component: IndexComponent
},
{
    path: 'new',
    component: NewQuoteComponent,
},
];
