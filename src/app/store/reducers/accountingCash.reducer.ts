import { createReducer, on } from '@ngrx/store';

import { CashFlowItem } from 'src/app/core/models/CashFlow';
import { CashItem } from 'src/app/core/models/Cash';
import * as actions from '../actions';
import { AppState } from '../app.reducer';

export interface State {
    cash: CashItem,
    pendings: CashFlowItem[],
    requisitions: CashFlowItem[]
}

export interface AppAccountingCash extends AppState {
    AccountingCash: State
}

export const STATE: State = {
    cash: null,
    pendings: [],
    requisitions: []
}

const _ACCOUNTING_CASH_REDUCER = createReducer(STATE,
    on(actions.SET_PENDINGS, (state, { cashFlows }) => ({ ...state, pendings: [...cashFlows] })),
    on(actions.SET_REQUISITIONS, (state, { cashFlows }) => ({ ...state, requisitions: [...cashFlows] })),
    on(actions.PENDINGS_TO_REQUSITIONS, (state, { cashFlows }) => ({ ...state, requisitions: [...state.requisitions, ...cashFlows], pendings: state.pendings.filter((pending) => !cashFlows.includes(pending)) })),
    on(actions.SET_CASH, (state, { cash }) => ({ ...state, cash })),
    on(actions.SET_CASH_FLOW, (state, { cashFlow }) => ({ ...state, cash: { ...state.cash, balance: cashFlow.balance }, pendings: [...state.pendings, cashFlow] })),
)

export function AccountingCashReducer(state, action) {
    return _ACCOUNTING_CASH_REDUCER(state, action)
}