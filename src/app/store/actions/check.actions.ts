import { createAction, props } from '@ngrx/store';

import { CheckItem } from '../../core/models/Check';

export const READ_CHECKS_TODAY = createAction(
	'[CHECKS_TODAY] Leer cheques del dia'
)

export const SET_CHECKS_TODAY = createAction(
	'[CHECKS_TODAY] Asignar cheques del dia',
	props<{ checks: CheckItem[] }>()
)
