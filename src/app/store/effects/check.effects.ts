import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, mergeMap } from 'rxjs/operators';

import { CheckService } from "src/app/core/services/httpServices/check.service";
import { READ_CHECKS_TODAY, SET_CHECKS_TODAY } from "../actions";

@Injectable()
export class CheckEffects {

    constructor(
        private actions$: Actions,
        private checkService: CheckService
    ) { }

    readChecksToday = createEffect(
        () => this.actions$
            .pipe(
                ofType(READ_CHECKS_TODAY),
                mergeMap(
                    () => this.checkService.getToday()
                        .pipe(
                            map(checks => SET_CHECKS_TODAY({checks}))
                        )
                )
            )
    )
}