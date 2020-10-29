import { Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const SessionRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'signin',
                component: SigninComponent
            },
            {
                path: 'not-found',
                data: { animation: 'isRight' },
                component: NotFoundComponent
            },
        ]
    }
];