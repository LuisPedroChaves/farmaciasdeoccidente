import { ActionReducerMap } from '@ngrx/store';
import * as reducers from './reducers';


export interface AppState {
   session: reducers.SessionState;
   config: reducers.ConfigState;
}



export const appReducers: ActionReducerMap<AppState> = {
   session: reducers.sessionReducer,
   config: reducers.configReducer
};
