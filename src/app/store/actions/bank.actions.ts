import { createAction, props } from '@ngrx/store';

import { BankAccountItem } from 'src/app/core/models/Bank';

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

export const UPDATE_BANK_ACCOUNT = createAction(
	'[BANK_ACCOUNT] Editar cuenta bancaria',
	props<{ bankAccount: BankAccountItem }>()
)

export const SET_EDIT_BANK_ACCOUNT = createAction(
	'[BANK_ACCOUNT] Asignar cuenta bancaria editada',
	props<{ bankAccount: BankAccountItem }>()
)

export const SET_BANK_ACCOUNT_BALANCE = createAction(
	'[BANK_ACCOUNT] Asignar balance a cuenta bancaria',
	props<{ idBankAccount: string, amount: number }>()
)