import { createAction, props } from '@ngrx/store';

import { CashItem } from 'src/app/core/models/Cash';
import { CashFlowItem } from 'src/app/core/models/CashFlow';
import { CashRequisitionItem } from 'src/app/core/models/CashRequisition';

export const READ_CASH = createAction(
	'[CASH] Cargar Caja'
);

export const SET_CASH = createAction(
	'[CASH] Asignar Caja',
	props<{ cash: CashItem }>()
)

export const READ_CASH_FLOWS = createAction(
	'[CASH_FLOW] Cargar pendientes de requisicion',
	props<{ idCash: string, state: string }>()
)

export const SET_PENDINGS = createAction(
	'[CASH_FLOW] Asignar pendientes',
	props<{ cashFlows: CashFlowItem[] }>()
)

export const SET_REQUISITIONS = createAction(
	'[CASH_FLOW] Asignar requisiciones',
	props<{ cashFlows: CashFlowItem[] }>()
)

export const PENDINGS_TO_REQUSITIONS = createAction(
	'[CASH_FLOW] Mover pendientes a requisiciones',
	props<{ cashFlows: CashFlowItem[] }>()
)

export const CREATE_CASH_FLOW = createAction(
	'[CASH_FLOW] Crear movimiento',
	props<{ cashFlow: CashFlowItem }>()
);

export const SET_CASH_FLOW = createAction(
	'[CASH_FLOW] Agregar movimiento',
	props<{ cashFlow: CashFlowItem }>()
);
