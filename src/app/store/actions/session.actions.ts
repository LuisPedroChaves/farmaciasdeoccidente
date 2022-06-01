import { createAction, props } from '@ngrx/store';

import { PermissionItem } from 'src/app/core/models/Role';
import { UserSession } from 'src/app/core/models/Session';

/* LOGIN ACTIONS ------------------------------------------------------------------*/
export const login = createAction('[Singin Component] Login', props<{ u: string, p: string }>());
export const loginSuccess = createAction('[Singin Component] Login Success', props<{ session: UserSession }>());
export const loginError = createAction('[Singin Component] Login Error', props<{ payload: any }>());
export const setMyRole = createAction('[Singin Component] SetMyRole', props<{ myroles: PermissionItem[] }>());

/* LOGIN ---------------------------------------------------------------------------------------------------------------- */
export const logout = createAction('[Singin Component] Logout',  props<{ id: string }>());
export const logoutSuccess = createAction('[Singin Component] logout Success');
export const logoutError = createAction('[Singin Component] logout Error', props<{ payload: any }>());
