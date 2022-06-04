import { createReducer, on } from '@ngrx/store';

import { CheckItem } from 'src/app/core/models/Check';
import * as actions from '../actions';
import { AppState } from '../app.reducer';

export interface CheckState {
    checksToday: CheckItem[],
}

export interface CheckStore extends AppState {
    check: CheckState
}

export const CHECK_STATE: CheckState = {
    checksToday: []
}

const _CHECK_REDUCER = createReducer(CHECK_STATE,
    on(actions.SET_CHECKS_TODAY, (state, { checks }) => ({ ...state, checksToday: [...checks] })),
)

export function CheckReducer(state, action) {
    return _CHECK_REDUCER(state, action)
}