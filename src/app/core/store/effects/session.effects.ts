import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, forkJoin } from 'rxjs';
import { mergeMap, map, catchError, delay, take } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import * as actions from '../actions';
@Injectable()
export class SessionEffects {
    constructor(private actions$: Actions, private authService: AuthService) {}



    loginEffect$ = createEffect( () => this.actions$.pipe(
        ofType(actions.login),
        mergeMap( ({ u, p }) => this.authService.login(u, p).pipe(
            map(data => {
                localStorage.setItem('farmaciasDO-session', JSON.stringify(data));
                return actions.loginSuccess({ session: data });
            }),
            catchError(err => {
                const MESSAGE = 'Usuario o Contraseña invalido';

                return of(actions.loginError({ payload: {...err, errorMessage: MESSAGE} }));
            })
        ))
    ));


    logout$ = createEffect( () => this.actions$.pipe(
        ofType(actions.logout),
        mergeMap( (action) => this.authService.logout(action.id).pipe(
            map(data => {
                localStorage.removeItem('farmaciasDO-session');
                return actions.logoutSuccess();
            }),
            catchError(err => {
                const MESSAGE = 'Usuario o Contraseña invalido';

                return of(actions.loginError({ payload: {...err, errorMessage: MESSAGE} }));
            })
        ))
    ));
}
