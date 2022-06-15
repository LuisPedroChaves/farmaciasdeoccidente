import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, mergeMap } from 'rxjs/operators';

import * as actions from '../actions/accounts-payable.actions';
import { ToastyService } from "src/app/core/services/internal/toasty.service";
import { CashRequisitionService } from "src/app/core/services/httpServices/cash-requisition.service";

@Injectable()
export class AccountsPayableEffects {

    constructor(
        private actions$: Actions,
        private toastyService: ToastyService,
        private cashRequisitionService: CashRequisitionService,
    ) { }

    readCashRequisitions = createEffect(
        () => this.actions$
            .pipe(
                ofType(actions.READ_CASH_REQUISITIONS),
                mergeMap(
                    () => this.cashRequisitionService.readAll()
                        .pipe(
                            map(cashRequisitions => actions.SET_CASH_REQUISITIONS({ cashRequisitions }))
                        )
                )
            )
    )

}