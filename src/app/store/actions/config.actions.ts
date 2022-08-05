import { createAction, props } from '@ngrx/store';

/* DEVICE ACTIONS ------------------------------------------------------------------*/
export const isLoading = createAction('[App Component] Is Loading', props<{ loading: boolean }>());
export const stopLoading = createAction('[App Component] Stop Loading', props<{ loading: boolean }>());
export const setSmallScreen = createAction('[App Component] Set small screen', props<{ small: boolean }>());
