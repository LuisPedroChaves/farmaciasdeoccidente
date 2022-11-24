import { createReducer, on } from '@ngrx/store';
import * as actions from '../actions';

export interface ConfigState {
    loading: boolean;
    smallScreen: boolean;
}

export const initialState: ConfigState = {
    loading: false,
    smallScreen: window.innerWidth < 960 ? true : false
};

const reducerConfig = createReducer(initialState,
    on(actions.isLoading, (state, { loading }) => ({ ...state, loading: true })),
    on(actions.stopLoading, (state, { loading }) => ({ ...state, loading: false })),
    on(actions.setSmallScreen, (state, { small }) => ({ ...state, smallScreen: small })),
);

export function configReducer(state, action) {
    return reducerConfig(state, action);
}
