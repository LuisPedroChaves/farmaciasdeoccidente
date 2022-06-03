import { createReducer, on } from '@ngrx/store';

import { BankAccountItem } from 'src/app/core/models/Bank';
import * as actions from '../actions';
import { AppState } from '../app.reducer';

export interface State {
    drawerOpen: boolean,
    drawerTitle: string,
    drawerComponent: string,
    bankAccounts: BankAccountItem[],
    bankAccount: BankAccountItem
}

export interface BankStore extends AppState {
    Bank: State
}

export const STATE: State = {
    drawerOpen: false,
    drawerTitle: '',
    drawerComponent: '',
    bankAccounts: [],
    bankAccount: null
}

const _BANK_REDUCER = createReducer(STATE,
    on(actions.OPEN_DRAWER, (state, { drawerTitle, drawerComponent }) => ({ ...state, drawerOpen: true, drawerTitle, drawerComponent })),
    on(actions.CLOSE_DRAWER, (state) => ({ ...state, drawerOpen: false })),
    on(actions.SET_BANK_ACCOUNTS, (state, { bankAccounts }) => ({
        ...state,
        bankAccounts: [...bankAccounts],
        bankAccount: (bankAccounts.length > 0) ? { ...bankAccounts[0] } : null
    })),
    on(actions.SET_NEW_BANK_ACCOUNT, (state, { bankAccount }) => ({ ...state, bankAccount: { ...bankAccount }, bankAccounts: [...state.bankAccounts, bankAccount] })),
    on(actions.SET_BANK_ACCOUNT, (state, { bankAccount }) => ({ ...state, bankAccount: { ...bankAccount } })),
)

export function BankReducer(state, action) {
    return _BANK_REDUCER(state, action)
}