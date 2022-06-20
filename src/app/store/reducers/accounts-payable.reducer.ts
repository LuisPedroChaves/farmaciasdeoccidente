import { createReducer, on } from '@ngrx/store';
import { CashFlowItem } from 'src/app/core/models/CashFlow';
import { CashRequisitionItem } from 'src/app/core/models/CashRequisition';

import * as actions from '../actions';
import { AppState } from '../app.reducer';

export interface AccountsPayableState {
    requisitions: CashRequisitionItem[],
    cashFlows: CashFlowItem[],
}

export interface AccountsPayableStore extends AppState {
    accountsPayable: AccountsPayableState
}

export const ACCOUNTS_PAYABLE_STATE: AccountsPayableState = {
    requisitions: [],
    cashFlows: []
}

const _ACCOUNTS_PAYABLE_REDUCER = createReducer(ACCOUNTS_PAYABLE_STATE,
    on(actions.SET_CASH_REQUISITIONS, (state, { cashRequisitions }) => ({ ...state, requisitions: [...cashRequisitions] })),
    on(actions.SET_CASH_FLOWS, (state, { cashFlows }) => ({ ...state, cashFlows: [...cashFlows] })),
)

export function AccountsPayableReducer(state, action) {
    return _ACCOUNTS_PAYABLE_REDUCER(state, action)
}