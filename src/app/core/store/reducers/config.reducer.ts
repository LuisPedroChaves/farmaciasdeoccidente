import { createReducer, on } from '@ngrx/store';
import * as actions from '../actions';

export interface ConfigState {
    loading: boolean;
}

export const initialState: ConfigState = {
    loading: false,
};

const reducerConfig = createReducer(initialState,
    on(actions.isLoading, (state, { loading }) => ({ ...state, loading: true })),
    on(actions.stopLoading, (state, { loading }) => ({ ...state, loading: false })),
);

export function configReducer(state, action) {
    return reducerConfig(state, action);
}
