import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, mergeMap } from 'rxjs/operators';

import { CashService } from "src/app/core/services/httpServices/cash.service";
import { CashFlowService } from "src/app/core/services/httpServices/cash-flow.service";
import * as actions from '../actions/accountingCash.actions';
import { ToastyService } from "src/app/core/services/internal/toasty.service";

@Injectable()
export class AccountingCashEffects {

    constructor(
        private actions$: Actions,
        private toastyService: ToastyService,
        private cashService: CashService,
        private cashFlowService: CashFlowService
    ) { }

    readCashFlows = createEffect(
        () => this.actions$
            .pipe(
                ofType(actions.READ_CASH_FLOWS),
                mergeMap(
                    ({ idCash, state }) => this.cashFlowService.readCash(idCash, state)
                        .pipe(
                            map(cashFlows => {

                                if (state === 'REQUISICION') {
                                    return actions.SET_REQUISITIONS({ cashFlows })
                                }

                                return actions.SET_PENDINGS({ cashFlows })
                            })
                        )
                )
            )
    )

    readCash = createEffect(
        () => this.actions$.pipe(
            ofType(actions.READ_CASH),
            mergeMap(
                () => this.cashService.getUser('CONTABLE')
                    .pipe(
                        map(cash => actions.SET_CASH({ cash }))
                    )
            )
        )
    );

    createCashFlow = createEffect(
        () => this.actions$
            .pipe(
                ofType(actions.CREATE_CASH_FLOW),
                mergeMap(
                    ({ cashFlow }) => this.cashFlowService.create(cashFlow)
                        .pipe(
                            map((cashFlow) => {
                                this.toastyService.success('Movimiento creado exitosamente')
                                return actions.SET_CASH_FLOW({ cashFlow })
                            })
                        )
                )
            )
    );

}
