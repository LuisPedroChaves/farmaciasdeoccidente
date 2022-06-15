import { createAction, props } from '@ngrx/store';
import { CashFlowItem } from 'src/app/core/models/CashFlow';

import { CashRequisitionItem } from 'src/app/core/models/CashRequisition';

export const READ_CASH_REQUISITIONS = createAction(
    '[CASH_REQUISITIONS] Leer requisiciones de cajas pendientes de pago'
)

export const SET_CASH_REQUISITIONS = createAction(
    '[CASH_REQUISITIONS] Asignar requisiciones pendientes de pago',
    props<{ cashRequisitions: CashRequisitionItem[] }>()
)

export const SET_CASH_FLOWS = createAction(
    '[CASH_FLOWS] Asiganar detalle de gastos de una caja especifica',
    props<{ cashFlows: CashFlowItem[] }>()
)