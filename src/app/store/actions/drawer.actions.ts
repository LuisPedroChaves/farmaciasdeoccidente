import { createAction, props } from '@ngrx/store';

export const OPEN_DRAWER = createAction(
	'[DRAWER] Abir cajón',
	props<{ drawerTitle: string, drawerComponent: string }>()
);

export const CLOSE_DRAWER = createAction(
    '[DRAWER] Cerrar cajón',
)