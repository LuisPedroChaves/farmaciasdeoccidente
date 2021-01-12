import { createReducer, on } from '@ngrx/store';
import * as actions from '../actions';
import { UserSession } from '../../models/Session';
import { PermissionItem } from '../../models/Role';

export interface SessionState {
    loading: boolean;
    loaded: boolean;
    error: any;
    token: string;
    currentUser: UserSession;
    permissions: PermissionItem[];
}


export const initialSessionState: SessionState = {
    loading: false,
    loaded: false,
    error: null,
    token: null,
    currentUser: null,
    permissions: null,
};


const reducerSession = createReducer(initialSessionState,
    // login
    on(actions.login, (state) => ({ ...state, loading: true, error: null})),
    on(actions.loginSuccess, (state, { session }) => ({ ...state, loading: false, loaded: true, error: null, currentUser: session, token: session.token })),
    on(actions.loginError, (state, { payload }) => ({ ...state, loading: false, loaded: true, error: { statusCode: payload.status, statusText: payload.statusText, error: payload.error, errorMsg: payload.errorMessage }})),
    on(actions.setMyRole, (state, { myroles }) => ({ ...state, permissions: myroles})),

    /* LOGOUT */
    on(actions.logout, (state) => ({...state, loading: true, error: null})),
    on(actions.logoutSuccess, (state) => ({...state, loading: false, error: null, token: null, currentUser: null, permissions: null})),
);


export function sessionReducer(state, action) {
    return reducerSession(state, action);
}
