import { createReducer, on } from '@ngrx/store';

import { CashFlowItem } from 'src/app/core/models/CashFlow';
import { CashItem } from 'src/app/core/models/Cash';
import * as actions from '../actions';
import { AppState } from '../app.reducer';

export interface AccountingCashState {
    cash: CashItem,
    pendings: CashFlowItem[],
    requisitions: CashFlowItem[]
}

export interface AccountingCashStore extends AppState {
    accountingCash: AccountingCashState
}

export const ACCOUNTING_CASH_STATE: AccountingCashState = {
    cash: null,
    pendings: [],
    requisitions: []
}

const _ACCOUNTING_CASH_REDUCER = createReducer(ACCOUNTING_CASH_STATE,
    on(actions.SET_PENDINGS, (state, { cashFlows }) => ({ ...state, pendings: [...cashFlows] })),
    on(actions.SET_REQUISITIONS, (state, { cashFlows }) => ({ ...state, requisitions: [...cashFlows] })),
    on(actions.PENDINGS_TO_REQUSITIONS, (state, { cashFlows }) => ({ ...state, requisitions: [...state.requisitions, ...cashFlows], pendings: state.pendings.filter((pending) => !cashFlows.includes(pending)) })),
    on(actions.SET_CASH, (state, { cash }) => ({ ...state, cash })),
    on(actions.SET_CASH_FLOW, (state, { cashFlow }) => ({ ...state, cash: { ...state.cash, balance: cashFlow.balance }, pendings: [...state.pendings, cashFlow] })),
)

export function AccountingCashReducer(state, action) {
    return _ACCOUNTING_CASH_REDUCER(state, action)
}