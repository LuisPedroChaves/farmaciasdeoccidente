import { createAction, props } from '@ngrx/store';

import { BankAccountItem } from 'src/app/core/models/Bank';

export const OPEN_DRAWER = createAction(
	'[DRAWER] Abir cajón',
	props<{ drawerTitle: string, drawerComponent: string }>()
);

export const CLOSE_DRAWER = createAction(
    '[DRAWER] Cerrar cajón',
)

export const READ_BANK_ACCOUNTS = createAction(
	'[BANK_ACCOUNTS] Leer cuentas bancarias'
)

export const SET_BANK_ACCOUNTS = createAction(
	'[BANK_ACCOUNTS] Asignar cuentas bancarias',
	props<{ bankAccounts: BankAccountItem[] }>()
)

export const CREATE_BANK_ACCOUNT = createAction(
	'[BANK_ACCOUNT] Crear nueva cuenta bancaria',
	props<{ bankAccount: BankAccountItem }>()
)

export const SET_NEW_BANK_ACCOUNT = createAction(
	'[BANK_ACCOUNT] Asignar nueva cuenta bancaria',
	props<{ bankAccount: BankAccountItem }>()
)

export const SET_BANK_ACCOUNT = createAction(
	'[BANK_ACCOUNT] Asignar cuenta bancaria',
	props<{ bankAccount: BankAccountItem }>()
)