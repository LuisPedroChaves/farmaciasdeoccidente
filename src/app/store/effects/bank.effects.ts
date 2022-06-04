import { Injectable } from "@angular/core";

import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, mergeMap } from 'rxjs/operators';

import { BankAccountService } from "src/app/core/services/httpServices/bank-account.service";
import { ToastyService } from "src/app/core/services/internal/toasty.service";
import * as actions from '../actions';

@Injectable()
export class BankEffects {

    constructor(
        private actions$: Actions,
        private bankAccountService: BankAccountService,
        private toastyService: ToastyService,
    ) { }

    readBankAccounts = createEffect(
        () => this.actions$
            .pipe(
                ofType(actions.READ_BANK_ACCOUNTS),
                mergeMap(
                    () => this.bankAccountService.read()
                        .pipe(
                            map(bankAccounts => actions.SET_BANK_ACCOUNTS({ bankAccounts }))
                        )
                )
            )
    )

    createBankAccount = createEffect(
        () => this.actions$
            .pipe(
                ofType(actions.CREATE_BANK_ACCOUNT),
                mergeMap(
                    ({ bankAccount }) => this.bankAccountService.create(bankAccount)
                        .pipe(
                            map(bankAccount => actions.SET_NEW_BANK_ACCOUNT({ bankAccount }))
                        )
                )
            )
    )

    updateBankAccount = createEffect(
        () => this.actions$
            .pipe(
                ofType(actions.UPDATE_BANK_ACCOUNT),
                mergeMap(
                    ({ bankAccount }) => this.bankAccountService.update(bankAccount)
                        .pipe(
                            map(bankAccount => actions.SET_EDIT_BANK_ACCOUNT({ bankAccount }))
                        )
                )
            )
    )

}
