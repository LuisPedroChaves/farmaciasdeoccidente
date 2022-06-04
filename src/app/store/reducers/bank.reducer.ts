import { createReducer, on } from '@ngrx/store';

import { BankAccountItem } from 'src/app/core/models/Bank';
import * as actions from '../actions';
import { AppState } from '../app.reducer';

export interface BankState {
    bankAccounts: BankAccountItem[],
    bankAccount: BankAccountItem
}

export interface BankStore extends AppState {
    bank: BankState
}

export const BANK_STATE: BankState = {
    bankAccounts: [],
    bankAccount: null
}

const _BANK_REDUCER = createReducer(BANK_STATE,
    on(actions.SET_BANK_ACCOUNTS, (state, { bankAccounts }) => ({
        ...state,
        bankAccounts: [...bankAccounts],
        bankAccount: (bankAccounts.length > 0) ? { ...bankAccounts[0] } : null
    })),
    on(actions.SET_NEW_BANK_ACCOUNT, (state, { bankAccount }) => ({ ...state, bankAccount: { ...bankAccount }, bankAccounts: [...state.bankAccounts, bankAccount] })),
    on(actions.SET_BANK_ACCOUNT, (state, { bankAccount }) => ({ ...state, bankAccount: { ...bankAccount } })),
    on(actions.SET_EDIT_BANK_ACCOUNT, (state, { bankAccount }) => ({
        ...state, bankAccount: { ...bankAccount },
        bankAccounts: state.bankAccounts.map(account => {
            if (account._id !== bankAccount._id) {
                return {
                    ...account
                }
            }

            return {
                ...account,
                name: bankAccount.name,
                type: bankAccount.type
            }
        })
    })),
    on(actions.SET_BANK_ACCOUNT_BALANCE, (state, { idBankAccount, amount }) => ({
        ...state, bankAccount: { ...state.bankAccount, balance: amount },
        bankAccounts: state.bankAccounts.map(account => {
            if (account._id !== idBankAccount) {
                return {
                    ...account
                }
            }

            return {
                ...account,
                balance: amount,
            }
        })
    })),
)

export function BankReducer(state, action) {
    return _BANK_REDUCER(state, action)
}