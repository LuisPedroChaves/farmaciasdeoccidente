import { createReducer, on } from '@ngrx/store';

import * as actions from '../actions';
import { AppState } from '../app.reducer';

export interface DrawerState {
    drawerOpen: boolean,
    drawerTitle: string,
    drawerComponent: string,
}

export interface DrawerStore extends AppState {
    drawer: DrawerState
}

export const DRAWER_STATE: DrawerState = {
    drawerOpen: false,
    drawerTitle: '',
    drawerComponent: '',
}

const _DRAWER_REDUCER = createReducer(DRAWER_STATE,
    on(actions.OPEN_DRAWER, (state, { drawerTitle, drawerComponent }) => ({ ...state, drawerOpen: true, drawerTitle, drawerComponent })),
    on(actions.CLOSE_DRAWER, (state) => ({ ...state, drawerOpen: false })),
)

export function DrawerReducer(state, action) {
    return _DRAWER_REDUCER(state, action)
}